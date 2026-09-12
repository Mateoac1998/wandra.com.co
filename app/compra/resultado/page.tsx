import { Suspense } from 'react';
import { PurchaseResult } from '@/components/purchase-result';

export default function PurchaseResultPage() {
  return <Suspense fallback={<main className="purchase-result"><p>Consultando el estado de tu compra…</p></main>}><PurchaseResult /></Suspense>;
}
