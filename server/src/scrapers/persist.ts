import { pb } from '../lib/pocketbase';
import { capitalizeFirstLetter } from '../utils';
import type { ScrapedRecipe } from './types';

const shelfCache = new Map<string, string>();
const ingredientCache = new Map<string, string>();

async function getOrCreateShelf(name: string): Promise<string> {
  if (!name) {
    return '';
  }

  const cached = shelfCache.get(name);
  if (cached) {
    return cached;
  }

  try {
    const existing = await pb.collection('store_shelves').getFirstListItem(`name="${name}"`);
    shelfCache.set(name, existing.id);
    return existing.id;
  } catch {
    const created = await pb.collection('store_shelves').create({ name });
    shelfCache.set(name, created.id);
    return created.id;
  }
}

async function getOrCreateIngredient(name: string, shelfName: string): Promise<string> {
  const normalizedName = capitalizeFirstLetter(name);

  const cached = ingredientCache.get(normalizedName);
  if (cached) {
    return cached;
  }

  try {
    const existing = await pb.collection('ingredients').getFirstListItem(`name="${normalizedName}"`);
    ingredientCache.set(normalizedName, existing.id);
    return existing.id;
  } catch {
    const shelfId = await getOrCreateShelf(shelfName);
    const data: Record<string, unknown> = { name: normalizedName };
    if (shelfId) {
      data.shelf = shelfId;
    }

    const created = await pb.collection('ingredients').create(data);
    ingredientCache.set(normalizedName, created.id);
    return created.id;
  }
}

async function recipeExists(slug: string): Promise<boolean> {
  try {
    await pb.collection('recipes').getFirstListItem(`slug="${slug}"`);
    return true;
  } catch {
    return false;
  }
}

export async function persistRecipes(recipes: ScrapedRecipe[]): Promise<{ saved: number; skipped: number }> {
  let saved = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    if (await recipeExists(recipe.slug)) {
      console.log(`[persist] Skipping "${recipe.name}" (slug already exists)`);
      skipped++;
      continue;
    }

    const recipeRecord = await pb.collection('recipes').create({
      name: recipe.name,
      slug: recipe.slug,
      source: recipe.source,
      image: recipe.image ?? '',
      preparationTime: recipe.preparationTime,
      bakingTime: recipe.bakingTime,
      restTime: recipe.restTime,
      seasons: recipe.seasons,
      category: recipe.category,
      nutriscore: recipe.nutriscore,
      tags: recipe.tags,
    });

    for (const step of recipe.steps) {
      await pb.collection('steps').create({
        recipe: recipeRecord.id,
        order: step.order,
        text: step.text,
      });
    }

    for (const ri of recipe.ingredients) {
      const ingredientId = await getOrCreateIngredient(ri.ingredient.name, ri.ingredient.storeShelf.name);

      await pb.collection('recipe_ingredients').create({
        recipe: recipeRecord.id,
        ingredient: ingredientId,
        quantity: ri.quantity,
        unit: ri.unit,
      });
    }

    saved++;
    console.log(`[persist] Saved "${recipe.name}" (${saved}/${recipes.length})`);
  }

  return { saved, skipped };
}

export function clearCaches() {
  shelfCache.clear();
  ingredientCache.clear();
}
