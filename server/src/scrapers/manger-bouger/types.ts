import type { Nutriscore } from '@chef-assistant/shared';

export type MangerBougerSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'AUTUMN';
export type MangerBougerRecipeCategory = 'START' | 'FULL_COURSE' | 'DESSERT' | 'SIDE' | 'COURSE' | 'OTHER';

export type Tag = {
  name: string;
  type: string;
};

export type RichText = {
  type: string;
  children: {
    text: string;
  }[];
};

export type Video = {
  file: string;
  poster: string;
  transcript: string;
};

export type MangerBougerStep = {
  order: number;
  text: RichText[];
  image: string | null;
  image_alt: string | null;
  family_profile: string | null;
  video: Video | null;
  ingredients: MangerBougerIngredient[];
};

export type MangerBougerRecipe = {
  id: string;
  name: string;
  slug: string;
  preparation_time: number;
  baking_time: number;
  rest_time: number;
  benefits: RichText[];
  portions: number;
  min_portions: number | null;
  max_portions: number | null;
  main_component: string;
  unbreakable: string | null;
  image: string;
  image_alt: string | null;
  cover_desktop: string | null;
  cover_mobile: string | null;
  cover_alt: string | null;
  video: Video | null;
  publication_platforms: string[];
  published: boolean;
  archived: boolean;
  recipe_category: MangerBougerRecipeCategory;
  ranking: string;
  seasons: MangerBougerSeason[];
  express: boolean;
  nutriscore: Nutriscore;
  kcal_per_100_g: number;
  kj_per_100_g: number;
  lipids_per_100_g: number;
  saturated_fatty_acids_per_100_g: number;
  carbohydrates_per_100_g: number;
  simple_sugars_per_100_g: number;
  fibres_per_100_g: number;
  salt_per_100_g: number;
  pnns_fruit_per_100_g: number;
  pnns_vegetable_per_100_g: number;
  oils_per_100_g: number;
  pnns_nuts_per_100_g: number;
  pnns_dried_vegetable_per_100_g: number;
  proteins_per_100_g: number;
  family_recipe: boolean;
  parent: boolean;
  tags: Tag[];
  steps: MangerBougerStep[];
  ingredients: MangerBougerIngredient[];
  children_recipes: MangerBougerRecipe[];
};

export type MangerBougerRecipes = MangerBougerRecipe[];

export type MeasurementUnit = {
  name: string;
  plural: string;
  use_ingredient_name: boolean;
  round_type: string;
};

export type IngredientRecipe = {
  quantity: number;
  measurement_unit: MeasurementUnit;
  gross_weight: number;
};

export type MangerBougerStoreShelf = {
  name: string;
};

export type MangerBougerIngredient = {
  name: string;
  display_name: string | null;
  display_plural: string | null;
  plural: string | null;
  frozen_or_canned: boolean;
  seasons: MangerBougerSeason[];
  with_pork: boolean | null;
  unbreakable: string | null;
  ignore_shopping_list: boolean;
  store_shelf: MangerBougerStoreShelf | null;
  ingredient_recipe: IngredientRecipe;
};

export type MangerBougerQueryResponse = {
  data: {
    recipeSearch: {
      data: MangerBougerRecipes;
      paginatorInfo: {
        hasMorePages: boolean;
      };
    };
  };
};
