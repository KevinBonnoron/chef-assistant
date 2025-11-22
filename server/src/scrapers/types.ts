import type { Category, CreateDto, Nutriscore, Season, Source, Step } from '@chef-assistant/shared';

export type ScrapedIngredient = {
  quantity: number | null;
  unit: string | null;
  ingredient: {
    name: string;
    storeShelf: { name: string };
  };
};

export type ScrapedRecipe = {
  name: string;
  slug: string;
  source: Source;
  image?: string;
  preparationTime: number;
  bakingTime: number;
  restTime: number;
  seasons: Season[];
  category: Category;
  nutriscore: Nutriscore;
  tags: string[];
  ingredients: ScrapedIngredient[];
  steps: CreateDto<Step>[];
};
