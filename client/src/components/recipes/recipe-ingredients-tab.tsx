import { useTranslation } from 'react-i18next';

type IngredientItem = {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
};

type RecipeIngredientsTabProps = {
  ingredients: IngredientItem[];
};

export function RecipeIngredientsTab({ ingredients }: RecipeIngredientsTabProps) {
  const { t } = useTranslation();

  if (ingredients.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">{t('noRecipes')}</p>;
  }

  return (
    <ul className="divide-y divide-border/60 py-3">
      {ingredients.map((ing) => (
        <li key={ing.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <span className="text-sm font-medium">{ing.name}</span>
          {(ing.quantity || ing.unit) && (
            <span className="text-sm text-muted-foreground tabular-nums">
              {ing.quantity} {ing.unit}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
