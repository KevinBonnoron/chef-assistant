import { ingredientsCollection, recipeIngredientsCollection, recipesCollection, stepsCollection } from '@/lib/collections';
import { Source } from '@chef-assistant/shared';
import type { Category, Nutriscore, Recipe, Season } from '@chef-assistant/shared';
import { useLiveQuery } from '@tanstack/react-db';
import { useMemo } from 'react';

export type RecipeFilters = {
  source?: Source;
  season?: Season;
  category?: Category;
  nutriscore?: Nutriscore;
  query?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  favoritesOnly?: boolean;
  favoriteRecipeIds?: Set<string>;
};

type RecipeFilterParams = Pick<RecipeFilters, 'season' | 'category' | 'nutriscore' | 'query' | 'favoritesOnly' | 'favoriteRecipeIds'>;

function matchesFilters(r: Recipe, recipeIngredientNames: Map<string, string[]>, params: RecipeFilterParams): boolean {
  const { season, category, nutriscore, query, favoritesOnly, favoriteRecipeIds } = params;
  if (season && !r.seasons?.includes(season)) return false;
  if (category && r.category !== category) return false;
  if (nutriscore && r.nutriscore !== nutriscore) return false;
  if (favoritesOnly && favoriteRecipeIds && !favoriteRecipeIds.has(r.id)) return false;
  if (query && query.trim().length > 0) {
    const q = query.toLowerCase().trim();
    if (!r.name.toLowerCase().includes(q)) {
      const names = recipeIngredientNames.get(r.id) ?? [];
      if (!names.some((name) => name.toLowerCase().includes(q))) return false;
    }
  }
  return true;
}

const PAGE_SIZE = 15;

/** Returns recipe counts per source with the same filters applied (season, category, nutriscore, query, favorites). */
export function useRecipeCountsBySource(filters: RecipeFilterParams = {}) {
  const { data: allRecipes } = useLiveQuery(recipesCollection);
  const { data: allRecipeIngredients } = useLiveQuery(recipeIngredientsCollection);
  const { data: allIngredients } = useLiveQuery(ingredientsCollection);

  const ingredientMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ing of allIngredients) {
      map.set(ing.id, ing.name);
    }
    return map;
  }, [allIngredients]);

  const recipeIngredientNames = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const ri of allRecipeIngredients) {
      const names = map.get(ri.recipe) ?? [];
      const ingredientName = ingredientMap.get(ri.ingredient);
      if (ingredientName) {
        names.push(ingredientName);
      }
      map.set(ri.recipe, names);
    }
    return map;
  }, [allRecipeIngredients, ingredientMap]);

  const countsBySource = useMemo(() => {
    const counts: Record<Source, number> = {} as Record<Source, number>;
    for (const s of Object.values(Source)) {
      counts[s] = 0;
    }
    const params: RecipeFilterParams = {
      season: filters.season,
      category: filters.category,
      nutriscore: filters.nutriscore,
      query: filters.query,
      favoritesOnly: filters.favoritesOnly,
      favoriteRecipeIds: filters.favoriteRecipeIds,
    };
    for (const r of allRecipes) {
      if (r.source in counts && matchesFilters(r, recipeIngredientNames, params)) {
        counts[r.source as Source]++;
      }
    }
    return counts;
  }, [allRecipes, recipeIngredientNames, filters.season, filters.category, filters.nutriscore, filters.query, filters.favoritesOnly, filters.favoriteRecipeIds]);

  return countsBySource;
}

export function useRecipes(filters: RecipeFilters = {}) {
  const { source, season, category, nutriscore, query, sortDirection = 'desc', page = 1, pageSize = PAGE_SIZE, favoritesOnly = false, favoriteRecipeIds } = filters;

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

  const recipeIngredientNames = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const ri of allRecipeIngredients) {
      const names = map.get(ri.recipe) ?? [];
      const ingredientName = ingredientMap.get(ri.ingredient);
      if (ingredientName) {
        names.push(ingredientName);
      }
      map.set(ri.recipe, names);
    }
    return map;
  }, [allRecipeIngredients, ingredientMap]);

  const filtered = useMemo(() => {
    const params: RecipeFilterParams = { season, category, nutriscore, query, favoritesOnly, favoriteRecipeIds };
    let result = allRecipes.filter((r) => (!source || r.source === source) && matchesFilters(r, recipeIngredientNames, params));

    // Sort by total cooking time
    result.sort((a, b) => {
      const timeA = (a.preparationTime ?? 0) + (a.bakingTime ?? 0);
      const timeB = (b.preparationTime ?? 0) + (b.bakingTime ?? 0);
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [allRecipes, source, season, category, nutriscore, query, sortDirection, favoritesOnly, favoriteRecipeIds, recipeIngredientNames]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  // Build steps map for paginated recipes
  const stepsMap = useMemo(() => {
    const map = new Map<string, typeof allSteps>();
    const recipeIds = new Set(paginated.map((r) => r.id));
    for (const step of allSteps) {
      if (recipeIds.has(step.recipe)) {
        const steps = map.get(step.recipe) ?? [];
        steps.push(step);
        map.set(step.recipe, steps);
      }
    }
    // Sort steps by order
    for (const [, steps] of map) {
      steps.sort((a, b) => a.order - b.order);
    }
    return map;
  }, [allSteps, paginated]);

  // Build ingredients map for paginated recipes
  const ingredientsMap = useMemo(() => {
    const map = new Map<
      string,
      Array<{
        id: string;
        name: string;
        quantity?: number;
        unit?: string;
        ingredientId: string;
      }>
    >();
    const recipeIds = new Set(paginated.map((r) => r.id));
    for (const ri of allRecipeIngredients) {
      if (recipeIds.has(ri.recipe)) {
        const ingredients = map.get(ri.recipe) ?? [];
        ingredients.push({
          id: ri.id,
          name: ingredientMap.get(ri.ingredient) ?? '',
          quantity: ri.quantity,
          unit: ri.unit,
          ingredientId: ri.ingredient,
        });
        map.set(ri.recipe, ingredients);
      }
    }
    return map;
  }, [allRecipeIngredients, paginated, ingredientMap]);

  return {
    recipes: paginated,
    stepsMap,
    ingredientsMap,
    totalCount,
    totalPages,
    currentPage,
    isLoading: recipesStatus !== 'ready',
  };
}
