import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useFilters } from '@/contexts/filters-context';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CategoryFilter } from './category-filter';
import { NutriscoreFilter } from './nutriscore-filter';
import { SeasonFilter } from './season-filter';

export function FilterPopover() {
  const { activeFilterCount, clearFilters } = useFilters();
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-11 w-11 shrink-0 rounded-xl">
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 && <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold rounded-full">{activeFilterCount}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 rounded-xl p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-3">
          <h3 className="font-semibold text-base">{t('filters')}</h3>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground" onClick={clearFilters}>
              <X className="h-3 w-3" />
              {t('clearFilters')}
            </Button>
          )}
        </div>
        <Separator />
        <div className="p-4 space-y-5">
          <SeasonFilter />
          <Separator />
          <CategoryFilter />
          <Separator />
          <NutriscoreFilter />
        </div>
      </PopoverContent>
    </Popover>
  );
}
