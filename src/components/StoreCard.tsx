import type { StoreWithDistance } from '../App';
import { PRODUCT_CATEGORIES, PRODUCTS } from '../types/store';
import { formatDistance } from '../utils/distance';

interface StoreCardProps {
  store: StoreWithDistance;
  showDistance?: boolean;
}

export function StoreCard({ store, showDistance }: StoreCardProps) {
  const availableProducts = PRODUCTS.filter((product) => store.products[product.key] === true);

  const groupedProducts = PRODUCT_CATEGORIES.map((category) => ({
    ...category,
    products: availableProducts.filter((p) => p.category === category.id),
  })).filter((group) => group.products.length > 0);

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Distance Badge */}
      {showDistance && store.distance !== undefined && (
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          📍 {formatDistance(store.distance)}
        </div>
      )}

      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white truncate group-hover:text-purple-300 transition-colors">
              {store.name}
            </h3>
            {store.note && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                {store.note}
              </span>
            )}
          </div>

          {/* Store Type Badge - positioned differently if distance is shown */}
          {(!showDistance || store.distance === undefined) && (
            <div
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                store.hasPhysicalStore
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {store.hasPhysicalStore ? '🏪 Fiziksel' : '🌐 Online'}
            </div>
          )}
        </div>

        {/* Store Type Badge below name when distance is shown */}
        {showDistance && store.distance !== undefined && (
          <div
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
              store.hasPhysicalStore
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}
          >
            {store.hasPhysicalStore ? '🏪 Fiziksel' : '🌐 Online'}
          </div>
        )}

        {/* Location */}
        {store.location && (
          <div className="mt-3 flex items-center gap-2 text-slate-400">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <span className="text-sm truncate">{store.location}</span>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="relative px-6 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {groupedProducts.map((group) =>
            group.products.map((product) => (
              <span
                key={product.key}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${group.color}15`,
                  color: group.color,
                  border: `1px solid ${group.color}30`,
                }}
              >
                {product.label}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-6 pb-6 pt-2 border-t border-slate-700/50">
        <div className="flex flex-wrap gap-2">
          {store.website ? (
            <a
              href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
            >
              <span>Siteye Git</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-400 text-sm font-medium rounded-xl">
              Web sitesi yok
            </span>
          )}

          {store.mapsUrl && (
            <a
              href={store.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
            >
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
              <span>Harita</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
