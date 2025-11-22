import { RecipeDetailContent } from '@/components/recipes/recipe-detail-content';
import { Button } from '@/components/ui/button';
import { useRecipe } from '@/hooks/use-recipe';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/recipe/$recipeId')({
  component: RecipePage,
});

function RecipePage() {
  const { recipeId } = useParams({ from: '/recipe/$recipeId' });
  const { recipe, steps, ingredients, isLoading, notFound } = useRecipe(recipeId);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="min-h-[400px] animate-pulse rounded-2xl border bg-muted/50" />
      </div>
    );
  }

  if (notFound || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <p className="text-lg font-medium text-foreground/80">{t('noRecipes')}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToList')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 shrink-0">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToList')}
        </Link>
      </Button>
      <div className="flex-1 min-h-0 min-w-0">
        <RecipeDetailContent recipe={recipe} steps={steps} ingredients={ingredients} />
      </div>
    </div>
  );
}
