#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORES_PATH = join(__dirname, '../src/data/stores.json');

function extractCoordsFromGoogleMapsUrl(url) {
  if (!url || url.trim() === '') return null;

  // Priority 1: !3d...!4d... format (actual place coordinates - most accurate)
  const pattern3d4d = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
  const match3d4d = url.match(pattern3d4d);
  if (match3d4d) {
    return {
      latitude: parseFloat(match3d4d[1]),
      longitude: parseFloat(match3d4d[2]),
    };
  }

  // Priority 2: ?q=lat,lng or &q=lat,lng
  const patternQ = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
  const matchQ = url.match(patternQ);
  if (matchQ) {
    return {
      latitude: parseFloat(matchQ[1]),
      longitude: parseFloat(matchQ[2]),
    };
  }

  // Priority 3: ll=lat,lng
  const patternLL = /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
  const matchLL = url.match(patternLL);
  if (matchLL) {
    return {
      latitude: parseFloat(matchLL[1]),
      longitude: parseFloat(matchLL[2]),
    };
  }

  // Priority 4 (fallback): /@lat,lng,zoom
  const patternAt = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
  const matchAt = url.match(patternAt);
  if (matchAt) {
    return {
      latitude: parseFloat(matchAt[1]),
      longitude: parseFloat(matchAt[2]),
    };
  }

  return null;
}

// Turkey bounds for validation
const TURKEY_BOUNDS = {
  minLat: 35.5,
  maxLat: 42.5,
  minLng: 25.5,
  maxLng: 45.0,
};

function isValidTurkeyCoord(lat, lng) {
  return (
    lat >= TURKEY_BOUNDS.minLat &&
    lat <= TURKEY_BOUNDS.maxLat &&
    lng >= TURKEY_BOUNDS.minLng &&
    lng <= TURKEY_BOUNDS.maxLng
  );
}

function main() {
  console.log('\n=== TCG Scope - Koordinat Düzeltme Scripti ===\n');

  const stores = JSON.parse(readFileSync(STORES_PATH, 'utf-8'));

  let fixed = 0;
  let invalid = [];

  for (const store of stores) {
    if (!store.mapsUrl) continue;

    const newCoords = extractCoordsFromGoogleMapsUrl(store.mapsUrl);
    if (!newCoords) continue;

    const oldLat = store.latitude;
    const oldLng = store.longitude;

    // Check if coordinates changed
    const latChanged = Math.abs((oldLat || 0) - newCoords.latitude) > 0.001;
    const lngChanged = Math.abs((oldLng || 0) - newCoords.longitude) > 0.001;

    if (latChanged || lngChanged) {
      console.log(`[${store.id}] ${store.name}`);
      console.log(`    Eski: ${oldLat}, ${oldLng}`);
      console.log(`    Yeni: ${newCoords.latitude}, ${newCoords.longitude}`);

      store.latitude = newCoords.latitude;
      store.longitude = newCoords.longitude;
      fixed++;

      // Validate
      if (!isValidTurkeyCoord(newCoords.latitude, newCoords.longitude)) {
        console.log(`    ⚠️  UYARI: Koordinat Türkiye sınırları dışında!`);
        invalid.push(store.name);
      } else {
        console.log(`    ✅ Düzeltildi`);
      }
    }

    // Also check if existing coords are valid
    if (store.latitude && store.longitude && !isValidTurkeyCoord(store.latitude, store.longitude)) {
      if (!invalid.includes(store.name)) {
        console.log(`\n[${store.id}] ${store.name}`);
        console.log(`    Koordinat: ${store.latitude}, ${store.longitude}`);
        console.log(`    ⚠️  UYARI: Koordinat Türkiye sınırları dışında!`);
        invalid.push(store.name);
      }
    }
  }

  if (fixed > 0) {
    writeFileSync(STORES_PATH, JSON.stringify(stores, null, 2) + '\n');
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ ${fixed} mağazanın koordinatları düzeltildi!`);
  } else {
    console.log('Düzeltilecek koordinat bulunamadı.');
  }

  if (invalid.length > 0) {
    console.log(`\n⚠️  Dikkat: ${invalid.length} mağazanın koordinatı şüpheli:`);
    invalid.forEach((name) => console.log(`   - ${name}`));
  }
}

main();
