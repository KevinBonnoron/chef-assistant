import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/hooks/use-favorites';
import type { Recipe } from '@chef-assistant/shared';
import { useNavigate } from '@tanstack/react-router';
import { SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RecipeCard } from './recipe-card';

type RecipeGridProps = {
  recipes: Recipe[];
  isLoading: boolean;
};

export function RecipeGrid({ recipes, isLoading }: RecipeGridProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, toggleRecipe } = useCart();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="flex flex-col overflow-hidden rounded-xl border bg-card">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="p-3.5 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/60 mb-6">
          <SearchX className="h-10 w-10 text-muted-foreground/60" />
        </div>
        <p className="text-lg font-medium text-foreground/80">{t('noRecipes')}</p>
        <p className="text-sm mt-1">Essayez de modifier vos filtres ou votre recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={isFavorite(recipe.id)}
          isInCart={isInCart(recipe.id)}
          onToggleFavorite={() => toggleFavorite(recipe.id)}
          onToggleCart={() => toggleRecipe(recipe.id)}
          onViewDetail={() => navigate({ to: '/recipe/$recipeId', params: { recipeId: recipe.id } })}
        />
      ))}
    </div>
  );
}
