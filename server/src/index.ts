import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { scrapeRoutes } from './routes';

const app = new Hono();

app.use(cors()).route('/api/scrape', scrapeRoutes);

export default app;
