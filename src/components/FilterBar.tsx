import type { ProductInfo } from '../types/store';
import { PRODUCT_CATEGORIES, PRODUCTS } from '../types/store';

interface FilterBarProps {
  cities: string[];
  selectedCity: string | null;
  onCityChange: (city: string | null) => void;
  selectedStoreType: 'all' | 'physical' | 'online';
  onStoreTypeChange: (type: 'all' | 'physical' | 'online') => void;
  selectedProducts: string[];
  onProductToggle: (productKey: string) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterBar({
  cities,
  selectedCity,
  onCityChange,
  selectedStoreType,
  onStoreTypeChange,
  selectedProducts,
  onProductToggle,
  onClearFilters,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const hasActiveFilters = selectedCity || selectedStoreType !== 'all' || selectedProducts.length > 0;

  const groupedProducts = PRODUCT_CATEGORIES.map((category) => ({
    ...category,
    products: PRODUCTS.filter((p) => p.category === category.id),
  }));

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtreler
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Result Count */}
        <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-sm text-slate-400">
            <span className="text-2xl font-bold text-white">{filteredCount}</span>
            <span className="ml-1">/ {totalCount} mağaza</span>
          </div>
        </div>

        {/* City Filter */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
          <label className="block text-sm font-semibold text-slate-300">
            📍 Şehir
          </label>
          <select
            value={selectedCity || ''}
            onChange={(e) => onCityChange(e.target.value || null)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.25em 1.25em',
            }}
          >
            <option value="">Tüm Şehirler</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Store Type Filter */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
          <label className="block text-sm font-semibold text-slate-300">
            🏬 Mağaza Türü
          </label>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tümü' },
              { value: 'physical', label: '🏪 Fiziksel' },
              { value: 'online', label: '🌐 Online' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onStoreTypeChange(option.value as 'all' | 'physical' | 'online')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedStoreType === option.value
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Filter */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
          <label className="block text-sm font-semibold text-slate-300">
            🎴 Ürün Kategorileri
          </label>
          <div className="space-y-4">
            {groupedProducts.map((group) => (
              <div key={group.id} className="space-y-2">
                <h4 
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: group.color }}
                >
                  {group.label}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {group.products.map((product: ProductInfo) => (
                    <button
                      key={product.key}
                      onClick={() => onProductToggle(product.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedProducts.includes(product.key)
                          ? 'ring-2 ring-offset-1 ring-offset-slate-800'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: selectedProducts.includes(product.key)
                          ? `${group.color}30`
                          : `${group.color}15`,
                        color: group.color,
                        boxShadow: selectedProducts.includes(product.key) 
                          ? `0 0 0 2px var(--tw-ring-offset-color, #1e293b), 0 0 0 4px ${group.color}` 
                          : 'none',
                      }}
                    >
                      {product.label.replace(group.label + ' ', '').replace('Pokémon ', '').replace('One Piece ', '').replace('Riftbound ', '')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coffee Link */}
        <a
          href="https://buymeacoffee.com/pokezed"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 transition-all group"
        >
          <span className="text-xl group-hover:animate-bounce">☕</span>
          <span className="text-sm font-medium">Listeyi Hazırlayanlara Kahve Ismarla</span>
        </a>
      </div>
    </aside>
  );
}

