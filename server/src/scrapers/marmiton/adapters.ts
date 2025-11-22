import { Nutriscore, Source } from '@chef-assistant/shared';
import type { MarmitonRecipe, MarmitonRecipeIngredient } from './types';
import type { ScrapedRecipe } from '../types';

function adaptMarmitonIngredient(ingredient: MarmitonRecipeIngredient) {
  return {
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    ingredient: {
      name: ingredient.name,
      storeShelf: { name: ingredient.storeShelf },
    },
  };
}

export function adaptMarmitonRecipe(recipe: MarmitonRecipe): ScrapedRecipe {
  return {
    slug: recipe.slug,
    name: recipe.name,
    preparationTime: recipe.preparationTime,
    bakingTime: recipe.bakingTime,
    restTime: 0,
    image: recipe.image,
    category: recipe.category,
    source: Source.MARMITON,
    seasons: [],
    tags: [],
    nutriscore: Nutriscore.UNKNOWN,
    ingredients: recipe.ingredients.map(adaptMarmitonIngredient),
    steps: recipe.steps.map((step) => ({
      order: step.order,
      text: step.text,
    })),
  };
}
