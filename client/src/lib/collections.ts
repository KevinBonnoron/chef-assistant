import type { Favorite, Ingredient, Recipe, RecipeIngredient, Step, StoreShelf } from '@chef-assistant/shared';
import { createCollection } from '@tanstack/db';
import { pocketbaseCollectionOptions } from 'pocketbase-db-collection';
import { pb } from './pocketbase';

export const recipesCollection = createCollection(
  pocketbaseCollectionOptions<Recipe>({
    id: 'recipes',
    recordService: pb.collection('recipes'),
  }),
);

export const stepsCollection = createCollection(
  pocketbaseCollectionOptions<Step>({
    id: 'steps',
    recordService: pb.collection('steps'),
  }),
);

export const ingredientsCollection = createCollection(
  pocketbaseCollectionOptions<Ingredient>({
    id: 'ingredients',
    recordService: pb.collection('ingredients'),
  }),
);

export const recipeIngredientsCollection = createCollection(
  pocketbaseCollectionOptions<RecipeIngredient>({
    id: 'recipe_ingredients',
    recordService: pb.collection('recipe_ingredients'),
  }),
);

export const storeShelfsCollection = createCollection(
  pocketbaseCollectionOptions<StoreShelf>({
    id: 'store_shelves',
    recordService: pb.collection('store_shelves'),
  }),
);

export const favoritesCollection = createCollection(
  pocketbaseCollectionOptions<Favorite>({
    id: 'favorites',
    recordService: pb.collection('favorites'),
  }),
);
