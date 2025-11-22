import { adaptMangerBougerRecipe } from './adapters';
import { queryMangerBouger } from './query';
import type { ScrapedRecipe } from '../types';

interface GetAllMangerBougerRecipesOptions {
  maxPage?: number;
  page?: number;
}

export async function getAllMangerBougerRecipes({ maxPage = Number.POSITIVE_INFINITY, page = 1 }: GetAllMangerBougerRecipesOptions = {}): Promise<ScrapedRecipe[]> {
  const recipes: ScrapedRecipe[] = [];

  let currentPage = page;
  let hasMorePages = true;
  while (hasMorePages && currentPage <= maxPage) {
    console.log(`[manger-bouger] Fetching page ${currentPage}`);
    const {
      data: {
        recipeSearch: { data, paginatorInfo },
      },
    } = await queryMangerBouger(0, currentPage);

    recipes.push(
      ...data.map((recipe) => {
        recipe.steps = recipe.steps.map((step) => ({
          ...step,
          text: JSON.parse(step.text as unknown as string),
        }));
        return adaptMangerBougerRecipe(recipe);
      }),
    );
    hasMorePages = paginatorInfo.hasMorePages;
    currentPage++;
  }

  return recipes;
}
