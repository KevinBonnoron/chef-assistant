import { Checkbox } from '@/components/ui/checkbox';
import { usePantry } from '@/contexts/pantry-context';
import type { Ingredient } from '@chef-assistant/shared';

type IngredientShelfGroupProps = {
  ingredients: Ingredient[];
};

export function IngredientShelfGroup({ ingredients }: IngredientShelfGroupProps) {
  const { isSelected, toggleIngredient } = usePantry();

  return (
    <ul className="space-y-1">
      {ingredients.map((ingredient) => {
        const checked = isSelected(ingredient.id);
        return (
          <li key={ingredient.id}>
            <label className="flex items-center gap-2.5 rounded-md px-1 py-1.5 text-sm cursor-pointer transition-colors hover:bg-accent/50">
              <Checkbox checked={checked} onCheckedChange={() => toggleIngredient(ingredient.id)} />
              <span className={checked ? 'font-medium' : ''}>{ingredient.name}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
