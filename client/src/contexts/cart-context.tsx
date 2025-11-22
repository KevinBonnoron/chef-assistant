import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

type CartContextValue = {
  selectedRecipeIds: Set<string>;
  isInCart: (recipeId: string) => boolean;
  toggleRecipe: (recipeId: string) => void;
  clearCart: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<Set<string>>(new Set());

  const isInCart = useCallback((recipeId: string) => selectedRecipeIds.has(recipeId), [selectedRecipeIds]);

  const toggleRecipe = useCallback((recipeId: string) => {
    setSelectedRecipeIds((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setSelectedRecipeIds(new Set());
  }, []);

  const value = useMemo(
    () => ({
      selectedRecipeIds,
      isInCart,
      toggleRecipe,
      clearCart,
      count: selectedRecipeIds.size,
    }),
    [selectedRecipeIds, isInCart, toggleRecipe, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
