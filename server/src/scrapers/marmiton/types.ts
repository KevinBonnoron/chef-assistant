import type { Category } from '@chef-assistant/shared';

export type MarmitonRecipeIngredient = {
  name: string;
  quantity: number | null;
  unit: string | null;
  storeShelf: string;
};

export type MarmitonRecipeStep = {
  order: number;
  text: string;
};

export type MarmitonRecipe = {
  id: string;
  slug: string;
  name: string;
  ingredients: MarmitonRecipeIngredient[];
  steps: MarmitonRecipeStep[];
  preparationTime: number;
  bakingTime: number;
  image: string;
  category: Category;
};

export type MarmitonQueryResponse = {
  recipe: MarmitonRecipe;
  links: string[];
};
