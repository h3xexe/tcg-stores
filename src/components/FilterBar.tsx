import type { LocationStatus } from '../hooks/useGeolocation';
import type { ProductInfo } from '../types/store';
import { PRODUCT_CATEGORIES, PRODUCTS } from '../types/store';
import { CITY_COORDINATES, type Coordinates } from '../utils/distance';

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
  // Location props
  userLocation: Coordinates | null;
  locationStatus: LocationStatus;
  locationError: string | null;
  sortByDistance: boolean;
  onSortByDistanceChange: (enabled: boolean) => void;
  onRequestLocation: () => void;
  onClearLocation: () => void;
  onManualLocationSelect: (coords: Coordinates) => void;
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
  userLocation,
  locationStatus,
  locationError,
  sortByDistance,
  onSortByDistanceChange,
  onRequestLocation,
  onClearLocation,
  onManualLocationSelect,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedCity || selectedStoreType !== 'all' || selectedProducts.length > 0 || userLocation;

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
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
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

        {/* Location Filter */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
          <label className="block text-sm font-semibold text-slate-300">
            📍 Konumuma Göre Sırala
          </label>

          {!userLocation ? (
            <div className="space-y-2">
              {/* Request GPS Location */}
              <button
                onClick={onRequestLocation}
                disabled={locationStatus === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 text-white text-sm font-medium transition-all"
              >
                {locationStatus === 'loading' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Konum alınıyor...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Konumumu Kullan
                  </>
                )}
              </button>

              {/* Error message */}
              {locationError && (
                <p className="text-xs text-red-400 text-center">{locationError}</p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <div className="flex-1 h-px bg-slate-700" />
                <span>veya şehir seç</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Manual City Selection */}
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CITY_COORDINATES).map(([city, coords]) => (
                  <button
                    key={city}
                    onClick={() => onManualLocationSelect(coords)}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Location Active Badge */}
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-emerald-400">Konum aktif</span>
                </div>
                <button
                  onClick={onClearLocation}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Kapat
                </button>
              </div>

              {/* Sort Toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">Yakınlığa göre sırala</span>
                <button
                  onClick={() => onSortByDistanceChange(!sortByDistance)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    sortByDistance ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      sortByDistance ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>
          )}
        </div>

        {/* City Filter */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
          <label className="block text-sm font-semibold text-slate-300">🏙️ Şehir Filtrele</label>
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
          <label className="block text-sm font-semibold text-slate-300">🏬 Mağaza Türü</label>
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
          <label className="block text-sm font-semibold text-slate-300">🎴 Ürün Kategorileri</label>
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
                      {product.label
                        .replace(group.label + ' ', '')
                        .replace('Pokémon ', '')
                        .replace('One Piece ', '')
                        .replace('Riftbound ', '')}
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
