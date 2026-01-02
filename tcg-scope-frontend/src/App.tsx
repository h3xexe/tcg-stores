import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { StoreList } from './components/StoreList';
import storesData from './data/stores.json';
import type { Store, ProductKey } from './types/store';

const stores = storesData as Store[];

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedStoreType, setSelectedStoreType] = useState<'all' | 'physical' | 'online'>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Şehirlerin listesini çıkar
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    stores.forEach((store) => {
      if (store.city) {
        citySet.add(store.city);
      }
    });
    return Array.from(citySet).sort();
  }, []);

  // Filtreleme işlemi
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      // Şehir filtresi
      if (selectedCity && store.city !== selectedCity) {
        return false;
      }

      // Mağaza türü filtresi
      if (selectedStoreType === 'physical' && !store.hasPhysicalStore) {
        return false;
      }
      if (selectedStoreType === 'online' && store.hasPhysicalStore) {
        return false;
      }

      // Ürün filtresi
      if (selectedProducts.length > 0) {
        const hasAllSelectedProducts = selectedProducts.every(
          (productKey) => store.products[productKey as ProductKey] === true
        );
        if (!hasAllSelectedProducts) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCity, selectedStoreType, selectedProducts]);

  const handleProductToggle = (productKey: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productKey)
        ? prev.filter((p) => p !== productKey)
        : [...prev, productKey]
    );
  };

  const handleClearFilters = () => {
    setSelectedCity(null);
    setSelectedStoreType('all');
    setSelectedProducts([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterBar
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            selectedStoreType={selectedStoreType}
            onStoreTypeChange={setSelectedStoreType}
            selectedProducts={selectedProducts}
            onProductToggle={handleProductToggle}
            onClearFilters={handleClearFilters}
            totalCount={stores.length}
            filteredCount={filteredStores.length}
          />
          
          <div className="flex-1 min-w-0">
            <StoreList stores={filteredStores} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-slate-400 text-sm">
              Bu liste zaman zaman güncellenmektedir. Son güncelleme:{' '}
              <span className="text-white font-medium">23 Kasım 2025</span>
            </p>
            <p className="text-slate-500 text-xs max-w-2xl mx-auto">
              Listede bulunan hiçbir firma reklam veya referans amaçlı yazılmamıştır. 
              Bilgilendirme amaçlıdır. Liste sıralaması tamamen rastgele yapılmıştır.
            </p>
            <div className="pt-4">
              <a
                href="https://buymeacoffee.com/pokezed"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>☕</span>
                <span className="text-sm">Hazırlayanlara Kahve Ismarla</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
