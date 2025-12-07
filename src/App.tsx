import { useMemo, useState } from 'react';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { StoreList } from './components/StoreList';
import storesData from './data/stores.json';
import type { ProductKey, Store } from './types/store';

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
            <p className="text-slate-500 text-xs">
              Kaynak:{' '}
              <a
                href="https://docs.google.com/spreadsheets/d/1NhCFUEdG6DuS1zxCTGYXNgiF9PJRT02HIj-Bh-a6y7M/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                Türkiye'de Orijinal TCG Satan Yerler (Google Sheets)
              </a>
            </p>
            <div className="pt-4">
              <a
                href="https://buymeacoffee.com/pokezed"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>☕</span>
                <span className="text-sm">Listeyi Hazırlayanlara Kahve Ismarla</span>
              </a>
            </div>
            
            {/* Credits */}
            <div className="pt-6 border-t border-slate-800 mt-6">
              <p className="text-slate-500 text-xs mb-2">Bu uygulamayı geliştirdi:</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a
                  href="https://x.com/hex2text"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-sm font-medium">@hex2text</span>
                </a>
                <span className="text-slate-600">×</span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 text-purple-300">
                  <span className="text-sm">🤖</span>
                  <span className="text-sm font-medium">Claude Opus 4.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
