import { Suspense } from 'react';
import UpdateItemPage from '../../components/update-item/UpdateItemPage'; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <UpdateItemPage />
    </Suspense>
  );
}
