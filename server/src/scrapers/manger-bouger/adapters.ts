import { Category, type CreateDto, type Ingredient, type RecipeIngredient, Season, Source, type Step, type StoreShelf } from '@chef-assistant/shared';
import type { MangerBougerIngredient, MangerBougerRecipe, MangerBougerRecipeCategory, MangerBougerSeason, MangerBougerStep, MangerBougerStoreShelf } from './types';
import type { ScrapedRecipe } from '../types';

function adaptMangerBougerStoreShelf(storeShelf: MangerBougerStoreShelf | null) {
  return {
    name: storeShelf?.name ?? '',
  } as CreateDto<StoreShelf>;
}

function adaptMangerBougerIngredient(ingredient: MangerBougerIngredient): Omit<CreateDto<Ingredient>, 'shelf'> & {
  storeShelf: Omit<StoreShelf, 'id'>;
} {
  return {
    name: ingredient.name,
    storeShelf: adaptMangerBougerStoreShelf(ingredient.store_shelf),
  };
}

function adaptMangerBougerRecipeIngredient(ingredient: MangerBougerIngredient) {
  return {
    quantity: ingredient.ingredient_recipe.quantity,
    unit: ingredient.ingredient_recipe.measurement_unit.name,
    ingredient: adaptMangerBougerIngredient(ingredient),
  };
}

function adaptMangerBougerStep(step: MangerBougerStep) {
  return {
    order: step.order,
    text: step.text.map((richText) => richText.children.map(({ text }) => text)).join(''),
  } as CreateDto<Step>;
}

const seasonMappings: Record<MangerBougerSeason, Season> = {
  SPRING: Season.SPRING,
  SUMMER: Season.SUMMER,
  AUTUMN: Season.AUTUMN,
  WINTER: Season.WINTER,
};
function adaptMangerBougerSeason(season: MangerBougerSeason): Season {
  return seasonMappings[season];
}

const recipeCategoryMappings: Record<MangerBougerRecipeCategory, Category> = {
  START: Category.STARTER,
  FULL_COURSE: Category.FULL_COURSE,
  DESSERT: Category.DESSERT,
  SIDE: Category.SIDE_DISH,
  COURSE: Category.MAIN_COURSE,
  OTHER: Category.OTHER,
};
function adaptMangerBougerRecipeCategory(category: MangerBougerRecipeCategory): Category {
  return recipeCategoryMappings[category];
}

export function adaptMangerBougerRecipe(recipe: MangerBougerRecipe): ScrapedRecipe {
  const category = adaptMangerBougerRecipeCategory(recipe.recipe_category);
  if (!category) {
    throw new Error(`Unknown category: ${recipe.recipe_category} for recipe ${recipe.slug}`);
  }

  return {
    name: recipe.name,
    slug: recipe.slug,
    source: Source.MANGER_BOUGER,
    preparationTime: recipe.preparation_time ?? 0,
    bakingTime: recipe.baking_time ?? 0,
    restTime: recipe.rest_time ?? 0,
    image: recipe.image,
    category,
    seasons: recipe.seasons.map(adaptMangerBougerSeason),
    nutriscore: recipe.nutriscore,
    tags: recipe.tags.map((tag) => tag.name),
    ingredients: recipe.ingredients.map(adaptMangerBougerRecipeIngredient),
    steps: recipe.steps.map(adaptMangerBougerStep),
  };
}
