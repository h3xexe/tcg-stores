import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { StoreWithDistance } from '../App';
import type { Coordinates } from '../utils/distance';
import { formatDistance } from '../utils/distance';
import { PRODUCTS } from '../types/store';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const storeIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// User location icon
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#fff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface MapViewProps {
  stores: StoreWithDistance[];
  userLocation: Coordinates | null;
}

// Zoom level 11 shows approximately 30km radius around center
const NEARBY_ZOOM_LEVEL = 11;

// Component to handle map bounds
function MapBounds({ stores, userLocation }: { stores: StoreWithDistance[]; userLocation: Coordinates | null }) {
  const map = useMap();

  useEffect(() => {
    // If user location is available, center on user with 30km radius view
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], NEARBY_ZOOM_LEVEL);
      return;
    }

    // Otherwise, fit all stores or show Turkey
    const storesWithCoords = stores.filter((s) => s.latitude && s.longitude);

    if (storesWithCoords.length === 0) {
      // Default to Turkey center
      map.setView([39.0, 35.0], 6);
      return;
    }

    const bounds = L.latLngBounds([]);

    storesWithCoords.forEach((store) => {
      if (store.latitude && store.longitude) {
        bounds.extend([store.latitude, store.longitude]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [stores, userLocation, map]);

  return null;
}

export function MapView({ stores, userLocation }: MapViewProps) {
  const storesWithCoords = stores.filter((s) => s.latitude && s.longitude);
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [39.0, 35.0]; // Turkey center

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-700/50">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        className="w-full h-full"
        style={{ background: '#1e293b' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapBounds stores={stores} userLocation={userLocation} />

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <strong>Konumunuz</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Store markers */}
        {storesWithCoords.map((store) => (
          <Marker
            key={store.id}
            position={[store.latitude!, store.longitude!]}
            icon={storeIcon}
          >
            <Popup>
              <StorePopup store={store} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <span>{storesWithCoords.length} mağaza haritada</span>
          {stores.length - storesWithCoords.length > 0 && (
            <span className="text-slate-500">
              ({stores.length - storesWithCoords.length} konum bilgisi yok)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StorePopup({ store }: { store: StoreWithDistance }) {
  const availableProducts = PRODUCTS.filter((p) => store.products[p.key] === true);

  return (
    <div style={{ minWidth: '220px', maxWidth: '300px' }}>
      <h3 style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '16px', marginBottom: '4px' }}>
        {store.name}
      </h3>

      {store.distance !== undefined && (
        <div style={{ color: '#059669', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
          📍 {formatDistance(store.distance)}
        </div>
      )}

      {store.location && (
        <p style={{ color: '#475569', fontSize: '14px', marginBottom: '8px' }}>{store.location}</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: store.hasPhysicalStore ? '#d1fae5' : '#dbeafe',
            color: store.hasPhysicalStore ? '#047857' : '#1d4ed8',
          }}
        >
          {store.hasPhysicalStore ? '🏪 Fiziksel' : '🌐 Online'}
        </span>
      </div>

      {availableProducts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {availableProducts.slice(0, 5).map((p) => (
            <span
              key={p.key}
              style={{
                padding: '2px 6px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                borderRadius: '4px',
                fontSize: '11px',
              }}
            >
              {p.label.split(' ')[0]}
            </span>
          ))}
          {availableProducts.length > 5 && (
            <span
              style={{
                padding: '2px 6px',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                borderRadius: '4px',
                fontSize: '11px',
              }}
            >
              +{availableProducts.length - 5}
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {store.website && (
          <a
            href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: '#9333ea',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            Siteye Git →
          </a>
        )}

        {store.mapsUrl && (
          <a
            href={store.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            📍 Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
