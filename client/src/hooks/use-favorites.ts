import { useLiveQuery } from '@tanstack/react-db';
import { useCallback, useMemo } from 'react';
import { favoritesCollection } from '@/lib/collections';
import { pb } from '@/lib/pocketbase';

export function useFavorites() {
  const { data: favorites, status } = useLiveQuery(favoritesCollection);

  const favoriteRecipeIds = useMemo(() => {
    return new Set(favorites.map((f) => f.recipe));
  }, [favorites]);

  const isFavorite = useCallback((recipeId: string) => favoriteRecipeIds.has(recipeId), [favoriteRecipeIds]);

  const toggleFavorite = useCallback(
    async (recipeId: string) => {
      const existing = favorites.find((f) => f.recipe === recipeId);
      if (existing) {
        await pb.collection('favorites').delete(existing.id);
      } else {
        await pb.collection('favorites').create({ recipe: recipeId });
      }
    },
    [favorites],
  );

  return {
    favorites,
    favoriteRecipeIds,
    isFavorite,
    toggleFavorite,
    isLoading: status !== 'ready',
  };
}
