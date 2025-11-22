import type { SourcePluginMeta } from '@chef-assistant/shared';
import { getAllMangerBougerRecipes } from './manger-bouger/main';
import { getAllMarmitonRecipes } from './marmiton/main';
import type { ScrapedRecipe } from './types';

export type ScraperBody = {
  maxPage?: number;
  limit?: number;
};

type ScraperRunner = (body: ScraperBody) => Promise<ScrapedRecipe[]>;

type RegisteredSource = {
  meta: SourcePluginMeta;
  run: ScraperRunner;
};

const registry = new Map<string, RegisteredSource>();

/**
 * Register a scraper source (plugin). To add a new source: implement a runner
 * and call register() with metadata + run function.
 */
function register(meta: SourcePluginMeta, run: ScraperRunner) {
  registry.set(meta.id, { meta, run });
}

/** Register built-in Manger Bouger scraper */
function registerMangerBouger() {
  register(
    {
      id: 'manger-bouger',
      label: 'Manger Bouger',
      description: 'API GraphQL officielle',
      options: [
        {
          key: 'maxPage',
          label: 'Pages max',
          description: 'Vide = toutes',
          type: 'number',
          optional: true,
        },
      ],
    },
    (body) => getAllMangerBougerRecipes({ maxPage: body.maxPage }),
  );
}

/** Register built-in Marmiton scraper */
function registerMarmiton() {
  register(
    {
      id: 'marmiton',
      label: 'Marmiton',
      description: 'Scraping HTML des recettes',
      options: [
        {
          key: 'limit',
          label: 'Limite de recettes',
          description: 'Vide = illimité',
          type: 'number',
          optional: true,
        },
      ],
    },
    (body) => getAllMarmitonRecipes(body.limit ?? -1),
  );
}

registerMangerBouger();
registerMarmiton();

/**
 * Returns all registered source plugins (for admin UI / dynamic source list).
 */
export function getSources(): SourcePluginMeta[] {
  return Array.from(registry.values()).map((r) => r.meta);
}

/**
 * Runs a registered scraper by id. Throws if source is unknown.
 */
export function runSource(sourceId: string, body: ScraperBody = {}): Promise<ScrapedRecipe[]> {
  const entry = registry.get(sourceId);
  if (!entry) {
    throw new Error(`Unknown source: ${sourceId}`);
  }
  return entry.run(body);
}

/**
 * Check if a source id is registered (for validation).
 */
export function hasSource(sourceId: string): boolean {
  return registry.has(sourceId);
}
