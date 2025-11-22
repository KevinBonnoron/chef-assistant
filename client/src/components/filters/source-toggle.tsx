import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilters } from '@/contexts/filters-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecipeCountsBySource } from '@/hooks/use-recipes';
import { Source } from '@chef-assistant/shared';
import { useTranslation } from 'react-i18next';

export function SourceToggle() {
  const { source, setSource, season, category, nutriscore, query } = useFilters();
  const { favoriteRecipeIds } = useFavorites();
  const { t } = useTranslation('filters');
  const countsBySource = useRecipeCountsBySource({
    season,
    category,
    nutriscore,
    query,
    favoriteRecipeIds,
  });

  return (
    <ToggleGroup
      type="single"
      value={source}
      onValueChange={(value) => {
        if (value) setSource(value as Source);
      }}
      className="inline-flex h-10 items-center justify-center rounded-xl bg-secondary/60 p-1"
    >
      {Object.values(Source).map((s) => (
        <ToggleGroupItem key={s} value={s} className="rounded-lg px-4 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm transition-all gap-1.5">
          {t(`sources.${s}`)}
          <Badge variant="secondary" className="h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full">
            {countsBySource[s] ?? 0}
          </Badge>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
