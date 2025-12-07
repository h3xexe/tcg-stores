import type { Store } from '../types/store';
import { StoreCard } from './StoreCard';

interface StoreListProps {
  stores: Store[];
}

export function StoreList({ stores }: StoreListProps) {
  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
          <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Mağaza Bulunamadı</h3>
        <p className="text-slate-500 text-center max-w-md">
          Seçtiğiniz kriterlere uygun mağaza bulunamadı. Filtreleri değiştirerek tekrar deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
}

