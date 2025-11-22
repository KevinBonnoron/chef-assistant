import { Badge } from '@/components/ui/badge';
import type { PantryRecipeMatch } from '@/hooks/use-pantry-recipes';
import { Link } from '@tanstack/react-router';
import { ChevronDown, Clock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type PantryRecipeCardProps = {
  match: PantryRecipeMatch;
  ingredientMap: Map<string, string>;
};

function getMatchColor(ratio: number): string {
  if (ratio === 1) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400';
  if (ratio >= 0.6) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400';
  return 'bg-muted text-muted-foreground';
}

function getBarColor(ratio: number): string {
  if (ratio === 1) return 'bg-emerald-500';
  if (ratio >= 0.6) return 'bg-amber-500';
  return 'bg-muted-foreground/40';
}

export function PantryRecipeCard({ match, ingredientMap }: PantryRecipeCardProps) {
  const { t } = useTranslation();
  const [showMissing, setShowMissing] = useState(false);
  const { recipe, matchCount, totalIngredients, matchRatio, missingIngredientIds } = match;
  const totalTime = (recipe.preparationTime ?? 0) + (recipe.bakingTime ?? 0);
  const hasMissing = missingIngredientIds.size > 0;

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <Link to="/recipe/$recipeId" params={{ recipeId: recipe.id }} className="flex gap-3 p-3">
        {/* Image */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
              <span className="text-2xl opacity-60">🍽️</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">{recipe.name}</h3>

          {totalTime > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {totalTime} {t('minutes')}
              </span>
            </div>
          )}

          {/* Match indicator */}
          <div className="flex items-center gap-2 mt-auto">
            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${getBarColor(matchRatio)}`} style={{ width: `${matchRatio * 100}%` }} />
            </div>
            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 shrink-0 ${getMatchColor(matchRatio)}`}>
              {t('pantryMatchRatio', { matched: matchCount, total: totalIngredients })}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Missing ingredients (expandable) */}
      {hasMissing && (
        <div className="border-t">
          <button
            type="button"
            onClick={() => setShowMissing((prev) => !prev)}
            className="flex w-full items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronDown className={`h-3 w-3 transition-transform ${showMissing ? 'rotate-180' : ''}`} />
            {t('pantryMissingIngredients')} ({missingIngredientIds.size})
          </button>
          {showMissing && (
            <div className="px-3 pb-2.5">
              <div className="flex flex-wrap gap-1">
                {[...missingIngredientIds].map((id) => (
                  <Badge key={id} variant="outline" className="text-[10px] font-normal">
                    {ingredientMap.get(id) ?? id}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
