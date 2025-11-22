import { Source } from '@chef-assistant/shared';

const BASE_URLS: Partial<Record<Source, string>> = {
  [Source.MARMITON]: 'https://www.marmiton.org/recettes',
  [Source.MANGER_BOUGER]: 'https://www.mangerbouger.fr/manger-mieux/la-fabrique-a-menus/recettes',
};

export function getRecipeSourceUrl(source: Source, slug: string): string | null {
  const base = BASE_URLS[source];
  if (!base || !slug) return null;
  return source === Source.MARMITON ? `${base}/${slug}.aspx` : `${base}/${slug}`;
}
