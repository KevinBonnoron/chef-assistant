import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePantry } from '@/contexts/pantry-context';
import { ingredientsCollection, storeShelfsCollection } from '@/lib/collections';
import type { Ingredient } from '@chef-assistant/shared';
import { useLiveQuery } from '@tanstack/react-db';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IngredientShelfGroup } from './ingredient-shelf-group';

const DEFAULT_SHELF_NAME = 'Autre';

type ShelfGroup = {
  shelfId: string;
  shelfName: string;
  ingredients: Ingredient[];
};

export function IngredientSelector() {
  const { t } = useTranslation();
  const { count, clearSelection, selectedIngredientIds, selectMultiple, deselectMultiple } = usePantry();
  const { data: allIngredients } = useLiveQuery(ingredientsCollection);
  const { data: allShelves } = useLiveQuery(storeShelfsCollection);

  const [localQuery, setLocalQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const shelfMap = useMemo(() => new Map(allShelves.map((s) => [s.id, s.name])), [allShelves]);

  // Group ingredients by shelf, filtered by search
  const groups = useMemo((): ShelfGroup[] => {
    const q = debouncedQuery.toLowerCase().trim();
    const filtered = q ? allIngredients.filter((i) => i.name.toLowerCase().includes(q)) : allIngredients;

    const groupMap = new Map<string, Ingredient[]>();
    for (const ingredient of filtered) {
      const shelfName = ingredient.shelf ? (shelfMap.get(ingredient.shelf) ?? DEFAULT_SHELF_NAME) : DEFAULT_SHELF_NAME;
      const items = groupMap.get(shelfName) ?? [];
      items.push(ingredient);
      groupMap.set(shelfName, items);
    }

    const result: ShelfGroup[] = [];
    for (const [shelfName, ingredients] of groupMap) {
      ingredients.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      const shelf = allShelves.find((s) => s.name === shelfName);
      result.push({ shelfId: shelf?.id ?? shelfName, shelfName, ingredients });
    }

    result.sort((a, b) => {
      if (a.shelfName === DEFAULT_SHELF_NAME) return 1;
      if (b.shelfName === DEFAULT_SHELF_NAME) return -1;
      return a.shelfName.localeCompare(b.shelfName, 'fr');
    });

    return result;
  }, [allIngredients, allShelves, shelfMap, debouncedQuery]);

  return (
    <div className="flex flex-col gap-3">
      {/* Header with count + clear */}
      <div className="flex items-center justify-between gap-2">
        {count > 0 ? (
          <>
            <span className="text-sm font-medium">{t('pantrySelectedCount', { count })}</span>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" onClick={clearSelection}>
              <X className="h-3 w-3 mr-1" />
              {t('pantryClearSelection')}
            </Button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">{t('pantrySubtitle')}</span>
        )}
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={t('pantrySearchPlaceholder')}
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Shelf accordion */}
      <ScrollArea className="flex-1 h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)]">
        <Accordion type="multiple" defaultValue={groups.map((g) => g.shelfId)}>
          {groups.map((group) => {
            const groupIds = group.ingredients.map((i) => i.id);
            const selectedInGroup = groupIds.filter((id) => selectedIngredientIds.has(id)).length;
            const allSelectedInGroup = selectedInGroup === group.ingredients.length;

            return (
              <AccordionItem key={group.shelfId} value={group.shelfId}>
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    {group.shelfName}
                    <Badge variant="secondary" className="rounded-full text-[10px] h-5 min-w-5 px-1.5">
                      {selectedInGroup > 0 ? `${selectedInGroup}/${group.ingredients.length}` : group.ingredients.length}
                    </Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-muted-foreground"
                      onClick={() => {
                        if (allSelectedInGroup) {
                          deselectMultiple(groupIds);
                        } else {
                          selectMultiple(groupIds);
                        }
                      }}
                    >
                      {allSelectedInGroup ? t('pantryDeselectAll') : t('pantrySelectAll')}
                    </Button>
                  </div>
                  <IngredientShelfGroup ingredients={group.ingredients} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
