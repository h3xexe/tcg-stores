export interface StoreProducts {
  pokemonEN: boolean | null;
  pokemonJP: boolean | null;
  pokemonKR: boolean | null;
  pokemonCN: boolean | null;
  onePieceEN: boolean | null;
  onePieceJP: boolean | null;
  mtg: boolean | null;
  riftboundEN: boolean | null;
  riftboundCN: boolean | null;
  lorcana: boolean | null;
  topps: boolean | null;
  yugioh: boolean | null;
}

export interface Store {
  id: number;
  name: string;
  products: StoreProducts;
  website: string;
  location: string | null;
  city: string | null;
  hasPhysicalStore: boolean;
  note?: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
}

export type ProductKey = keyof StoreProducts;

export interface ProductInfo {
  key: ProductKey;
  label: string;
  category: 'pokemon' | 'onepiece' | 'mtg' | 'riftbound' | 'lorcana' | 'topps' | 'yugioh';
}

export const PRODUCTS: ProductInfo[] = [
  { key: 'pokemonEN', label: 'Pokémon İngilizce', category: 'pokemon' },
  { key: 'pokemonJP', label: 'Pokémon Japonca', category: 'pokemon' },
  { key: 'pokemonKR', label: 'Pokémon Korece', category: 'pokemon' },
  { key: 'pokemonCN', label: 'Pokémon Çince', category: 'pokemon' },
  { key: 'onePieceEN', label: 'One Piece İngilizce', category: 'onepiece' },
  { key: 'onePieceJP', label: 'One Piece Japonca', category: 'onepiece' },
  { key: 'mtg', label: 'Magic: The Gathering', category: 'mtg' },
  { key: 'riftboundEN', label: 'Riftbound İngilizce', category: 'riftbound' },
  { key: 'riftboundCN', label: 'Riftbound Çince', category: 'riftbound' },
  { key: 'lorcana', label: 'Lorcana', category: 'lorcana' },
  { key: 'topps', label: 'TOPPS', category: 'topps' },
  { key: 'yugioh', label: 'Yu-Gi-Oh!', category: 'yugioh' },
];

export const PRODUCT_CATEGORIES = [
  { id: 'pokemon', label: 'Pokémon', color: '#FFCB05' },
  { id: 'onepiece', label: 'One Piece', color: '#E31837' },
  { id: 'mtg', label: 'MTG', color: '#9B4DCA' },
  { id: 'riftbound', label: 'Riftbound', color: '#00A86B' },
  { id: 'lorcana', label: 'Lorcana', color: '#1E88E5' },
  { id: 'topps', label: 'TOPPS', color: '#FF6B35' },
  { id: 'yugioh', label: 'Yu-Gi-Oh!', color: '#B8860B' },
] as const;

