import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFilters } from '@/contexts/filters-context';
import { FilterPopover } from '../filters/filter-popover';
import { SourceToggle } from '../filters/source-toggle';
import { ShoppingListDialog } from '../shopping/shopping-list-dialog';

export function SearchBar() {
  const { t } = useTranslation();
  const { query, setQuery, sortDirection, toggleSort } = useFilters();
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, setQuery]);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('searchPlaceholder')} value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} className="pl-10 pr-10 h-11 rounded-xl bg-secondary/50 border-transparent focus-visible:border-primary/30 focus-visible:bg-background transition-colors" />
          {localQuery && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setLocalQuery('')}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-xl" onClick={toggleSort}>
                {sortDirection === 'desc' ? <ArrowDownWideNarrow className="h-4 w-4" /> : <ArrowUpNarrowWide className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{sortDirection === 'desc' ? t('sortDesc') : t('sortAsc')}</TooltipContent>
          </Tooltip>

          <FilterPopover />
          <ShoppingListDialog />
        </div>
      </div>

      <SourceToggle />
    </div>
  );
}
