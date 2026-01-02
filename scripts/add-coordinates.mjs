#!/usr/bin/env node

import { createInterface } from 'readline';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORES_PATH = join(__dirname, '../src/data/stores.json');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function extractCoordsFromGoogleMapsUrl(url) {
  if (!url || url.trim() === '') return null;

  // Priority 1: !3d...!4d... format (actual place coordinates - most accurate)
  // This is the actual location, not the map view center
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

  // Priority 4 (fallback): /@lat,lng,zoom - map view center (less accurate)
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

async function main() {
  console.log('\n=== TCG Scope - Koordinat Ekleme Scripti ===\n');

  // Read stores
  let stores = JSON.parse(readFileSync(STORES_PATH, 'utf-8'));

  // STEP 1: Find stores with "ve" in location that need to be split
  const storesToSplit = stores.filter(
    (store) => store.location && store.location.includes(' ve ')
  );

  if (storesToSplit.length > 0) {
    console.log('='.repeat(50));
    console.log('ADIM 1: Çoklu konum içeren mağazaları ayırma');
    console.log('='.repeat(50));
    console.log(`\n${storesToSplit.length} mağaza birden fazla konum içeriyor:\n`);

    for (const store of storesToSplit) {
      console.log(`\n[${store.id}] ${store.name}`);
      console.log(`    Mevcut konum: ${store.location}`);

      const parts = store.location.split(' ve ');
      console.log(`    Tespit edilen konumlar:`);
      parts.forEach((p, i) => console.log(`      ${i + 1}. ${p.trim()}`));

      const shouldSplit = await question('\n    Bu mağazayı ayırmak istiyor musunuz? (e/h): ');

      if (shouldSplit.toLowerCase() === 'e') {
        const storeIndex = stores.findIndex((s) => s.id === store.id);
        const originalStore = stores[storeIndex];

        // Get the max ID
        const maxId = Math.max(...stores.map((s) => s.id));

        // Update first location
        const loc1 = await question(`    1. konum adı [${parts[0].trim()}]: `);
        const location1 = loc1.trim() || parts[0].trim();

        // Create second store
        const loc2 = await question(`    2. konum adı [${parts[1].trim()}]: `);
        const location2 = loc2.trim() || parts[1].trim();

        // Determine city for each
        const city1 = originalStore.city;
        const city2Input = await question(`    2. konum şehri [${city1}]: `);
        const city2 = city2Input.trim() || city1;

        // Update original store
        stores[storeIndex] = {
          ...originalStore,
          location: location1,
          latitude: undefined,
          longitude: undefined,
          mapsUrl: undefined,
        };

        // Create new store for second location
        const newStore = {
          ...originalStore,
          id: maxId + 1,
          name: `${originalStore.name} (${location2.split(' ').pop()})`,
          location: location2,
          city: city2,
          latitude: undefined,
          longitude: undefined,
          mapsUrl: undefined,
        };

        // Ask for custom name
        const customName = await question(`    2. mağaza adı [${newStore.name}]: `);
        if (customName.trim()) {
          newStore.name = customName.trim();
        }

        stores.push(newStore);
        console.log(`    ✅ Mağaza ikiye ayrıldı: "${stores[storeIndex].name}" ve "${newStore.name}"`);
      } else {
        console.log('    ⏭️  Atlandı');
      }
    }

    // Save after splitting
    writeFileSync(STORES_PATH, JSON.stringify(stores, null, 2) + '\n');
    console.log('\n✅ Ayırma işlemi kaydedildi.\n');

    // Reload stores
    stores = JSON.parse(readFileSync(STORES_PATH, 'utf-8'));
  }

  // STEP 2: Find stores needing coordinates or mapsUrl
  console.log('\n' + '='.repeat(50));
  console.log('ADIM 2: Koordinat ve Maps linki ekleme');
  console.log('='.repeat(50));

  const storesNeedingData = stores.filter(
    (store) =>
      store.hasPhysicalStore &&
      store.location &&
      (!store.latitude || !store.longitude || !store.mapsUrl)
  );

  if (storesNeedingData.length === 0) {
    console.log('\nTüm fiziksel mağazaların koordinatları ve Maps linkleri mevcut!');
    rl.close();
    return;
  }

  console.log(`\n${storesNeedingData.length} mağaza için veri gerekiyor.\n`);
  console.log('Her mağaza için Google Maps linkini yapıştırın.');
  console.log('Atlamak için boş bırakıp Enter\'a basın.\n');
  console.log('-'.repeat(50));

  let updated = 0;

  for (const store of storesNeedingData) {
    const hasCoords = store.latitude && store.longitude;
    const hasMapsUrl = !!store.mapsUrl;

    console.log(`\n[${store.id}] ${store.name}`);
    console.log(`    Konum: ${store.location}`);
    if (store.website) {
      console.log(`    Website: ${store.website}`);
    }

    if (hasCoords) {
      console.log(`    📍 Koordinat: ${store.latitude}, ${store.longitude}`);
      console.log(`    ⚠️  Maps linki eksik`);
    } else {
      console.log(`    ⚠️  Koordinat ve Maps linki eksik`);
    }

    const mapsUrl = await question('\n    Google Maps linki: ');

    if (!mapsUrl.trim()) {
      console.log('    ⏭️  Atlandı');
      continue;
    }

    const storeIndex = stores.findIndex((s) => s.id === store.id);

    if (!hasCoords) {
      const coords = extractCoordsFromGoogleMapsUrl(mapsUrl);

      if (!coords) {
        console.log('    ❌ Koordinat bulunamadı! Link formatı desteklenmiyor olabilir.');
        const retry = await question('    Tekrar denemek ister misiniz? (e/h): ');
        if (retry.toLowerCase() === 'e') {
          const retryUrl = await question('    Google Maps linki: ');
          const retryCoords = extractCoordsFromGoogleMapsUrl(retryUrl);
          if (retryCoords) {
            stores[storeIndex].latitude = retryCoords.latitude;
            stores[storeIndex].longitude = retryCoords.longitude;
            stores[storeIndex].mapsUrl = retryUrl.trim();
            console.log(`    ✅ Eklendi: ${retryCoords.latitude}, ${retryCoords.longitude}`);
            updated++;
          } else {
            console.log('    ❌ Yine bulunamadı, atlanıyor.');
          }
        }
        continue;
      }

      stores[storeIndex].latitude = coords.latitude;
      stores[storeIndex].longitude = coords.longitude;
      stores[storeIndex].mapsUrl = mapsUrl.trim();
      console.log(`    ✅ Koordinat eklendi: ${coords.latitude}, ${coords.longitude}`);
    } else {
      stores[storeIndex].mapsUrl = mapsUrl.trim();
      console.log(`    ✅ Maps linki eklendi`);
    }

    updated++;
  }

  // Save updated stores
  if (updated > 0) {
    writeFileSync(STORES_PATH, JSON.stringify(stores, null, 2) + '\n');
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ ${updated} mağaza güncellendi ve kaydedildi!`);
  } else {
    console.log('\nHiçbir mağaza güncellenmedi.');
  }

  rl.close();
}

main().catch(console.error);
