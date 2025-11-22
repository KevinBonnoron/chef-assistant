import { ingredientsCollection, recipeIngredientsCollection, storeShelfsCollection } from '@/lib/collections';
import { useLiveQuery } from '@tanstack/react-db';
import { useMemo } from 'react';

export type ShoppingItem = {
  ingredientId: string;
  name: string;
  quantity?: number;
  unit?: string;
};

export type ShoppingGroup = {
  shelfName: string;
  shelfId: string;
  items: ShoppingItem[];
};

const DEFAULT_SHELF_NAME = 'Défaut';

export function useShoppingList(selectedRecipeIds: Set<string>) {
  const { data: allRecipeIngredients } = useLiveQuery(recipeIngredientsCollection);
  const { data: allIngredients } = useLiveQuery(ingredientsCollection);
  const { data: allShelves } = useLiveQuery(storeShelfsCollection);

  const groups = useMemo(() => {
    if (selectedRecipeIds.size === 0) {
      return [];
    }

    // Build ingredient lookup
    const ingredientMap = new Map(allIngredients.map((i) => [i.id, i]));
    const shelfMap = new Map(allShelves.map((s) => [s.id, s.name]));

    // Aggregate quantities per ingredient
    const aggregated = new Map<string, { name: string; quantity: number; unit: string; shelfId: string }>();

    for (const ri of allRecipeIngredients) {
      if (!selectedRecipeIds.has(ri.recipe)) continue;

      const ingredient = ingredientMap.get(ri.ingredient);
      if (!ingredient) continue;

      const existing = aggregated.get(ri.ingredient);
      if (existing) {
        if (ri.quantity && ri.unit === existing.unit) {
          existing.quantity += ri.quantity;
        }
      } else {
        aggregated.set(ri.ingredient, {
          name: ingredient.name,
          quantity: ri.quantity ?? 0,
          unit: ri.unit ?? '',
          shelfId: ingredient.shelf ?? '',
        });
      }
    }

    // Group by shelf
    const shelfGroups = new Map<string, ShoppingItem[]>();
    for (const [ingredientId, item] of aggregated) {
      const shelfName = item.shelfId ? (shelfMap.get(item.shelfId) ?? DEFAULT_SHELF_NAME) : DEFAULT_SHELF_NAME;

      const items = shelfGroups.get(shelfName) ?? [];
      items.push({
        ingredientId,
        name: item.name,
        quantity: item.quantity || undefined,
        unit: item.unit || undefined,
      });
      shelfGroups.set(shelfName, items);
    }

    // Convert to sorted array
    const result: ShoppingGroup[] = [];
    for (const [shelfName, items] of shelfGroups) {
      items.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      const shelf = allShelves.find((s) => s.name === shelfName);
      result.push({
        shelfName,
        shelfId: shelf?.id ?? '',
        items,
      });
    }

    result.sort((a, b) => {
      if (a.shelfName === DEFAULT_SHELF_NAME) return 1;
      if (b.shelfName === DEFAULT_SHELF_NAME) return -1;
      return a.shelfName.localeCompare(b.shelfName, 'fr');
    });

    return result;
  }, [selectedRecipeIds, allRecipeIngredients, allIngredients, allShelves]);

  const totalItems = useMemo(() => groups.reduce((acc, g) => acc + g.items.length, 0), [groups]);

  return { groups, totalItems };
}
