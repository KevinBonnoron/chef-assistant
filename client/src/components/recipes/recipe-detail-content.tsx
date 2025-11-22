import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Recipe, Step } from '@chef-assistant/shared';
import { getRecipeSourceUrl } from '@/utils/recipe-url';
import { Clock, ExternalLink, Flame, Timer, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RecipeIngredientsTab } from './recipe-ingredients-tab';
import { RecipeStepsTab } from './recipe-steps-tab';

export type IngredientItem = {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
};

type RecipeDetailContentProps = {
  recipe: Recipe;
  steps: Step[];
  ingredients: IngredientItem[];
};

export function RecipeDetailContent({ recipe, steps, ingredients }: RecipeDetailContentProps) {
  const { t } = useTranslation();
  const totalTime = (recipe.preparationTime ?? 0) + (recipe.bakingTime ?? 0);
  const hasTimings = (recipe.preparationTime ?? 0) > 0 || (recipe.bakingTime ?? 0) > 0 || (recipe.restTime ?? 0) > 0;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden rounded-2xl border bg-card">
      {/* Hero image */}
      {recipe.image ? (
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <h1 className="text-xl font-bold text-white leading-tight drop-shadow-md">{recipe.name}</h1>
          </div>
        </div>
      ) : (
        <div className="p-5 pb-0">
          <h1 className="text-xl font-bold">{recipe.name}</h1>
        </div>
      )}

      {getRecipeSourceUrl(recipe.source, recipe.slug) && (
        <div className="px-5 pt-2">
          <a
            href={getRecipeSourceUrl(recipe.source, recipe.slug)!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t('viewRecipeOn', { source: t(`filters:sources.${recipe.source}`) })}
          </a>
        </div>
      )}

      {/* Time badges */}
      {hasTimings && (
        <div className="flex flex-wrap gap-2 px-5 pt-4">
          {(recipe.preparationTime ?? 0) > 0 && (
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <UtensilsCrossed className="h-3 w-3" />
              {recipe.preparationTime} {t('minutes')}
            </Badge>
          )}
          {(recipe.bakingTime ?? 0) > 0 && (
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Flame className="h-3 w-3" />
              {recipe.bakingTime} {t('minutes')}
            </Badge>
          )}
          {(recipe.restTime ?? 0) > 0 && (
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Timer className="h-3 w-3" />
              {recipe.restTime} {t('minutes')}
            </Badge>
          )}
          {totalTime > 0 && (
            <Badge className="gap-1.5 rounded-full px-3 py-1">
              <Clock className="h-3 w-3" />
              {totalTime} {t('minutes')}
            </Badge>
          )}
        </div>
      )}

      <Separator className="mt-4" />

      <Tabs defaultValue="steps" className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TabsList className="w-full shrink-0 justify-start rounded-none border-b bg-transparent px-5 h-11">
          <TabsTrigger value="steps" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            {t('steps')} ({steps.length})
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            {t('ingredients')} ({ingredients.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <TabsContent value="steps" className="mt-0 flex-1 min-h-0 data-[state=inactive]:hidden flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <div className="px-5 pb-5">
                <RecipeStepsTab steps={steps} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="ingredients" className="mt-0 flex-1 min-h-0 data-[state=inactive]:hidden flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <div className="px-5 pb-5">
                <RecipeIngredientsTab ingredients={ingredients} />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
