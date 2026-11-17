begin;

alter table public.orders
  add column if not exists mercadopago_payment_id text,
  add column if not exists paid_at timestamptz;

create unique index if not exists orders_mercadopago_payment_id_key
  on public.orders (mercadopago_payment_id)
  where mercadopago_payment_id is not null;

create table public.order_fulfillment (
  order_id uuid not null references public.orders(id) on delete cascade,
  action text not null check (action in ('shipment', 'admin_email', 'customer_email')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'review')),
  claim_token uuid,
  first_started_at timestamptz,
  updated_at timestamptz not null default now(),
  tracking_numbers text[],
  result jsonb,
  last_error text,
  primary key (order_id, action)
);

alter table public.order_fulfillment enable row level security;
revoke all on public.order_fulfillment from public, anon, authenticated;
grant select, insert, update on public.order_fulfillment to service_role;

create function public.confirm_paid_order(p_order_id uuid, p_payment_id text, p_amount numeric)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_order public.orders%rowtype;
begin
  select * into current_order from public.orders where id = p_order_id for update;
  if not found then
    return jsonb_build_object('state', 'missing');
  end if;
  if p_amount is null or p_amount <= 0 or current_order.total_amount is distinct from p_amount
      or p_payment_id is null or p_payment_id !~ '^[0-9]+$' then
    return jsonb_build_object('state', 'mismatch');
  end if;
  if current_order.status = 'paid' and current_order.mercadopago_payment_id is null then
    return jsonb_build_object('state', 'legacy_paid');
  end if;
  if current_order.status = 'pending' and current_order.mercadopago_payment_id is null then
    update public.orders
    set status = 'paid', mercadopago_payment_id = p_payment_id, paid_at = now()
    where id = p_order_id
    returning * into current_order;

    insert into public.order_fulfillment (order_id, action)
    values (p_order_id, 'shipment'), (p_order_id, 'admin_email'), (p_order_id, 'customer_email');
  elsif current_order.status is distinct from 'paid'
      or current_order.mercadopago_payment_id is distinct from p_payment_id then
    return jsonb_build_object('state', 'mismatch');
  end if;
  return jsonb_build_object('state', 'ready', 'order', to_jsonb(current_order));
end;
$$;

create function public.claim_order_fulfillment(p_order_id uuid, p_action text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  job public.order_fulfillment%rowtype;
begin
  select * into job
  from public.order_fulfillment
  where order_id = p_order_id and action = p_action
  for update;

  if not found then
    raise exception 'Fulfillment action missing';
  end if;
  if job.status in ('done', 'review') then
    return jsonb_build_object('state', job.status);
  end if;
  if job.status = 'processing' and job.updated_at > now() - interval '2 minutes' then
    return jsonb_build_object('state', 'busy');
  end if;

  -- Envia does not document a deduplication guarantee for label purchases.
  -- Resend deduplicates for 24 hours. Leave a buffer before that window ends.
  if (p_action = 'shipment' and job.status = 'processing')
      or (p_action <> 'shipment' and job.first_started_at <= now() - interval '23 hours') then
    update public.order_fulfillment
    set status = 'review', claim_token = null, updated_at = now(), last_error = 'attempt_unconfirmed'
    where order_id = p_order_id and action = p_action;
    return jsonb_build_object('state', 'review');
  end if;

  update public.order_fulfillment
  set status = 'processing', claim_token = gen_random_uuid(), updated_at = now(),
      first_started_at = coalesce(first_started_at, now())
  where order_id = p_order_id and action = p_action
  returning * into job;
  return jsonb_build_object('state', 'claimed', 'token', job.claim_token);
end;
$$;

revoke all on function public.confirm_paid_order(uuid, text, numeric) from public, anon, authenticated;
revoke all on function public.claim_order_fulfillment(uuid, text) from public, anon, authenticated;
grant execute on function public.confirm_paid_order(uuid, text, numeric) to service_role;
grant execute on function public.claim_order_fulfillment(uuid, text) to service_role;

commit;
