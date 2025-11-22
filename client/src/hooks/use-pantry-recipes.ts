import { ingredientsCollection, recipeIngredientsCollection, recipesCollection } from '@/lib/collections';
import type { Recipe } from '@chef-assistant/shared';
import { useLiveQuery } from '@tanstack/react-db';
import { useMemo } from 'react';

export type PantryRecipeMatch = {
  recipe: Recipe;
  matchCount: number;
  totalIngredients: number;
  matchRatio: number;
  matchedIngredientIds: Set<string>;
  missingIngredientIds: Set<string>;
};

export function usePantryRecipes(selectedIngredientIds: Set<string>) {
  const { data: allRecipes, status: recipesStatus } = useLiveQuery(recipesCollection);
  const { data: allRecipeIngredients } = useLiveQuery(recipeIngredientsCollection);
  const { data: allIngredients } = useLiveQuery(ingredientsCollection);

  // Map ingredient ID → name for display
  const ingredientMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ing of allIngredients) {
      map.set(ing.id, ing.name);
    }
    return map;
  }, [allIngredients]);

  // Build reverse index: recipeId → Set<ingredientId>
  const recipeIngredientSets = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const ri of allRecipeIngredients) {
      let set = map.get(ri.recipe);
      if (!set) {
        set = new Set();
        map.set(ri.recipe, set);
      }
      set.add(ri.ingredient);
    }
    return map;
  }, [allRecipeIngredients]);

  // Compute matches
  const matches = useMemo((): PantryRecipeMatch[] => {
    if (selectedIngredientIds.size === 0) return [];

    const results: PantryRecipeMatch[] = [];

    for (const recipe of allRecipes) {
      const recipeIngredients = recipeIngredientSets.get(recipe.id);
      if (!recipeIngredients || recipeIngredients.size === 0) continue;

      const matchedIngredientIds = new Set<string>();
      const missingIngredientIds = new Set<string>();

      for (const ingredientId of recipeIngredients) {
        if (selectedIngredientIds.has(ingredientId)) {
          matchedIngredientIds.add(ingredientId);
        } else {
          missingIngredientIds.add(ingredientId);
        }
      }

      if (matchedIngredientIds.size === 0) continue;

      const totalIngredients = recipeIngredients.size;
      const matchCount = matchedIngredientIds.size;
      const matchRatio = matchCount / totalIngredients;

      results.push({
        recipe,
        matchCount,
        totalIngredients,
        matchRatio,
        matchedIngredientIds,
        missingIngredientIds,
      });
    }

    // Sort: ratio desc → fewer missing asc → total time asc
    results.sort((a, b) => {
      if (b.matchRatio !== a.matchRatio) return b.matchRatio - a.matchRatio;
      if (a.missingIngredientIds.size !== b.missingIngredientIds.size)
        return a.missingIngredientIds.size - b.missingIngredientIds.size;
      const timeA = (a.recipe.preparationTime ?? 0) + (a.recipe.bakingTime ?? 0);
      const timeB = (b.recipe.preparationTime ?? 0) + (b.recipe.bakingTime ?? 0);
      return timeA - timeB;
    });

    return results;
  }, [allRecipes, recipeIngredientSets, selectedIngredientIds]);

  const perfectCount = useMemo(() => matches.filter((m) => m.matchRatio === 1).length, [matches]);

  return {
    matches,
    ingredientMap,
    perfectCount,
    isLoading: recipesStatus !== 'ready',
  };
}
