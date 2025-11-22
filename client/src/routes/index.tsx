import { createFileRoute } from '@tanstack/react-router';
import { SearchBar } from '@/components/layout/search-bar';
import { RecipePagination } from '@/components/pagination/recipe-pagination';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { CartProvider } from '@/contexts/cart-context';
import { FiltersProvider, useFilters } from '@/contexts/filters-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecipes } from '@/hooks/use-recipes';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <FiltersProvider>
      <CartProvider>
        <RecipesView />
      </CartProvider>
    </FiltersProvider>
  );
}

function RecipesView() {
  const filters = useFilters();
  const { favoriteRecipeIds } = useFavorites();

  const { recipes, totalPages, currentPage, isLoading } = useRecipes({
    source: filters.source,
    season: filters.season,
    category: filters.category,
    nutriscore: filters.nutriscore,
    query: filters.query,
    sortDirection: filters.sortDirection,
    page: filters.page,
    favoriteRecipeIds,
  });

  return (
    <div className="space-y-6">
      <SearchBar />
      <RecipeGrid recipes={recipes} isLoading={isLoading} />
      <RecipePagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
