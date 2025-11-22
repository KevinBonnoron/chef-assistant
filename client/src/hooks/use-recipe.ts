import { ingredientsCollection, recipeIngredientsCollection, recipesCollection, stepsCollection } from '@/lib/collections';
import type { IngredientItem } from '@/components/recipes/recipe-detail-content';
import { useLiveQuery } from '@tanstack/react-db';
import { useMemo } from 'react';

export function useRecipe(recipeId: string | undefined) {
  const { data: allRecipes, status: recipesStatus } = useLiveQuery(recipesCollection);
  const { data: allSteps } = useLiveQuery(stepsCollection);
  const { data: allRecipeIngredients } = useLiveQuery(recipeIngredientsCollection);
  const { data: allIngredients } = useLiveQuery(ingredientsCollection);

  const ingredientMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ing of allIngredients) {
      map.set(ing.id, ing.name);
    }
    return map;
  }, [allIngredients]);

  const recipe = useMemo(() => (recipeId ? allRecipes.find((r) => r.id === recipeId) ?? null : null), [allRecipes, recipeId]);

  const steps = useMemo(() => {
    if (!recipeId) return [];
    const list = allSteps.filter((s) => s.recipe === recipeId);
    list.sort((a, b) => a.order - b.order);
    return list;
  }, [allSteps, recipeId]);

  const ingredients = useMemo((): IngredientItem[] => {
    if (!recipeId) return [];
    return allRecipeIngredients
      .filter((ri) => ri.recipe === recipeId)
      .map((ri) => ({
        id: ri.id,
        name: ingredientMap.get(ri.ingredient) ?? '',
        quantity: ri.quantity,
        unit: ri.unit,
      }));
  }, [allRecipeIngredients, recipeId, ingredientMap]);

  const isLoading = recipesStatus !== 'ready';
  const notFound = !isLoading && !!recipeId && !recipe;

  return { recipe, steps, ingredients, isLoading, notFound };
}
