import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { clearCaches, persistRecipes } from '../scrapers/persist';
import { getSources, hasSource, runSource } from '../scrapers/registry';

const bodySchema = z
  .object({
    maxPage: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
  })
  .optional()
  .default({});

export const scrapeRoutes = new Hono()
  .get('/', (c) => {
    return c.json(getSources());
  })
  .post(
    '/:source',
    zValidator(
      'param',
      z.object({
        source: z.string().refine((id) => hasSource(id), { message: 'Unknown source' }),
      }),
    ),
    zValidator('json', bodySchema),
    async (c) => {
      const { source } = c.req.valid('param');
      const body = c.req.valid('json');

      console.log(`[scrape] Starting ${source} scraping...`);
      clearCaches();

      const recipes = await runSource(source, body);
      console.log(`[scrape] Fetched ${recipes.length} recipes, persisting...`);

      const result = await persistRecipes(recipes);
      console.log(`[scrape] Done: ${result.saved} saved, ${result.skipped} skipped`);

      return c.json({ source, fetched: recipes.length, ...result });
    },
  );
