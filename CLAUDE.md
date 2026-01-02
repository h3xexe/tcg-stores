# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TCG Türkiye (TCG Scope) is a web application that helps users find authentic Trading Card Game (TCG) stores in Turkey. Users can filter stores by city, store type (physical/online), and product categories (Pokémon, One Piece, MTG, etc.).

## Commands

```bash
npm run dev      # Start dev server on port 5174
npm run build    # TypeScript compile + Vite build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4

**Data Flow:**
- Store data is imported from `src/data/stores.json` (converted from CSV source)
- `App.tsx` manages filter state (`selectedCity`, `selectedStoreType`, `selectedProducts`)
- Filtering logic uses `useMemo` to compute filtered stores based on current filter state
- `FilterBar` receives filter state and handlers as props
- `StoreList` renders `StoreCard` components for each filtered store

**Key Types (`src/types/store.ts`):**
- `Store` - Main store interface with products, location, and metadata
- `StoreProducts` - Boolean flags for each TCG product type (pokemonEN, mtg, lorcana, etc.)
- `ProductKey` - Union type of product keys for type-safe filtering
- `PRODUCTS` and `PRODUCT_CATEGORIES` - Static metadata for UI rendering

**Components:**
- `Header` - Site branding
- `FilterBar` - City dropdown, store type buttons, product category toggles
- `StoreList` - Container for store cards with empty state handling
- `StoreCard` - Individual store display with product badges and links

## Deployment

Deployed to Vercel. The `vercel.json` configures SPA routing with rewrites to `index.html`.
