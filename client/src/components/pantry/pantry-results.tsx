import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePantry } from '@/contexts/pantry-context';
import { usePantryRecipes } from '@/hooks/use-pantry-recipes';
import { Search, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PantryRecipeCard } from './pantry-recipe-card';

export function PantryResults() {
  const { t } = useTranslation();
  const { selectedIngredientIds, count } = usePantry();
  const { matches, ingredientMap, perfectCount, isLoading } = usePantryRecipes(selectedIngredientIds);

  // Empty state: no ingredients selected
  if (count === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 text-muted-foreground">
        <Search className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-sm text-center">{t('pantryNoSelection')}</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  // No results
  if (matches.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 text-muted-foreground">
        <UtensilsCrossed className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-sm text-center">{t('pantryNoResults')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Summary */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">{t('pantryRecipesFound', { count: matches.length })}</span>
        {perfectCount > 0 && (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0">
            {t('pantryPerfectMatches', { count: perfectCount })}
          </Badge>
        )}
      </div>

      {/* Results list */}
      <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
        <div className="flex flex-col gap-2.5 pr-3">
          {matches.map((match) => (
            <PantryRecipeCard key={match.recipe.id} match={match} ingredientMap={ingredientMap} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
