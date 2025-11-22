import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

type PantryContextValue = {
  selectedIngredientIds: Set<string>;
  isSelected: (ingredientId: string) => boolean;
  toggleIngredient: (ingredientId: string) => void;
  selectMultiple: (ingredientIds: string[]) => void;
  deselectMultiple: (ingredientIds: string[]) => void;
  clearSelection: () => void;
  count: number;
};

const PantryContext = createContext<PantryContextValue | null>(null);

export function PantryProvider({ children }: { children: ReactNode }) {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (ingredientId: string) => selectedIngredientIds.has(ingredientId),
    [selectedIngredientIds],
  );

  const toggleIngredient = useCallback((ingredientId: string) => {
    setSelectedIngredientIds((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  }, []);

  const selectMultiple = useCallback((ingredientIds: string[]) => {
    setSelectedIngredientIds((prev) => {
      const next = new Set(prev);
      for (const id of ingredientIds) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const deselectMultiple = useCallback((ingredientIds: string[]) => {
    setSelectedIngredientIds((prev) => {
      const next = new Set(prev);
      for (const id of ingredientIds) {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIngredientIds(new Set());
  }, []);

  const value = useMemo(
    () => ({
      selectedIngredientIds,
      isSelected,
      toggleIngredient,
      selectMultiple,
      deselectMultiple,
      clearSelection,
      count: selectedIngredientIds.size,
    }),
    [selectedIngredientIds, isSelected, toggleIngredient, selectMultiple, deselectMultiple, clearSelection],
  );

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return ctx;
}
