import { adaptMarmitonRecipe } from './adapters';
import { queryMarmiton, resetParsedUrls } from './query';
import type { ScrapedRecipe } from '../types';

const defaultStartUrls = ['https://www.marmiton.org/recettes/recette_poulet-coco-reunionnais_16242.aspx'];

export async function getAllMarmitonRecipes(limit = -1) {
  resetParsedUrls();
  const urlToParse = [...defaultStartUrls];
  const recipes: ScrapedRecipe[] = [];

  while (urlToParse.length > 0) {
    if (limit !== -1 && recipes.length >= limit) {
      break;
    }

    console.log(`[marmiton] Fetching... (${urlToParse.length} URLs in queue, ${recipes.length} recipes found)`);
    const url = urlToParse.shift();
    if (!url) {
      break;
    }

    const result = await queryMarmiton(url);
    if (!result) {
      continue;
    }

    const { recipe, links } = result;
    recipes.push(adaptMarmitonRecipe(recipe));
    urlToParse.push(...links);
  }

  return recipes;
}
