# Chef Assistant

A full-stack recipe management application. Browse recipes from multiple sources, filter by category and season, view ingredients and steps, manage favorites, and build shopping lists. Recipes are scraped from external sites (Marmiton, Manger Bouger) and stored in a local database.

## Features

- **Recipe catalog**: Browse recipes with pagination, search, and filters (category, Nutri-Score, season, source).
- **Recipe details**: View ingredients and step-by-step instructions in tabs.
- **Favorites**: Save and manage favorite recipes.
- **Shopping list**: Generate a shopping list from recipe ingredients, grouped by store shelf.
- **Admin scraping**: Trigger scrapers (Marmiton, Manger Bouger) to fetch and persist new recipes via the API.
- **PWA**: Installable web app with offline support and update notifications.
- **i18n**: French translations for the UI.

## Tech Stack

- **Runtime & package manager**: [Bun](https://bun.sh)
- **Monorepo**: Workspaces with [Turbo](https://turbo.build) for build and dev
- **Client**: [React](https://react.dev) + [Vite](https://vitejs.dev), [TanStack Router](https://tanstack.com/router), [Tailwind CSS](https://tailwindcss.com), [PocketBase](https://pocketbase.io) client
- **Server**: [Hono](https://hono.dev) API with recipe scrapers (Marmiton, Manger Bouger)
- **Database**: [PocketBase](https://pocketbase.io) (in `db/`)
- **Shared**: TypeScript types and DTOs used by both client and server
- **Linting / formatting**: [Biome](https://biomejs.dev)

## Project Structure

```
.
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # UI, layout, recipes, filters, shopping, admin
│       ├── contexts/    # Cart, filters
│       ├── hooks/       # Recipes, favorites, shopping list, PWA
│       ├── routes/      # TanStack Router (home, recipe detail, admin)
│       └── i18n/        # French locales
├── server/          # Hono API + scrapers
│   └── src/
│       ├── routes/      # API routes (including scrape)
│       ├── scrapers/    # Marmiton, Manger Bouger + registry & persist
│       └── lib/         # Config, logger
├── shared/          # Shared TypeScript types (Recipe, Category, etc.)
├── db/              # PocketBase (migrations, hooks)
├── docker/          # Dockerfile, nginx, supervisord for deployment
└── package.json     # Root workspaces and Turbo scripts
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.2.4 or compatible)

### Installation

```bash
bun install
```

### Development

From the project root:

```bash
bun run dev
```

This runs all workspaces in development mode (client, server, etc.) via Turbo. Ensure PocketBase is running for the `db` workspace if the client or server depend on it.

You can also run workspaces individually:

```bash
bun run dev:client   # Vite dev server (client)
bun run dev:server   # Hono server
```

### Building

```bash
bun run build
```

Builds all workspaces. For single packages:

```bash
bun run build:client
bun run build:server
```

### Other commands

```bash
bun run lint        # Biome lint
bun run type-check  # TypeScript check across workspaces
bun run format      # Biome format
```

## API (Server)

The Hono server exposes:

- **Scrape**
  - `GET /scrape` — List available scrape sources (Marmiton, Manger Bouger).
  - `POST /scrape/:source` — Run a scraper by `source` id. Optional body: `{ maxPage?, limit? }`. Fetched recipes are persisted to the database.

Other routes are defined in `server/src/routes/`. The client talks to PocketBase for recipes, favorites, and shopping list data; the server is used mainly for scraping.

## Type sharing

The `shared` package holds types used by both client and server (e.g. `Recipe`, `Category`, `Source`). Import from the workspace:

```ts
import type { Recipe, Source } from '@chef-assistant/shared';
```

## License

See [LICENSE](LICENSE).
