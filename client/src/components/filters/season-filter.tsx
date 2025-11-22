import { Button } from '@/components/ui/button';
import { useFilters } from '@/contexts/filters-context';
import { Season } from '@chef-assistant/shared';
import { Leaf, Snowflake, Sun, Trees } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const seasonIcons = {
  [Season.WINTER]: Snowflake,
  [Season.SPRING]: Leaf,
  [Season.SUMMER]: Sun,
  [Season.AUTUMN]: Trees,
} as const;

export function SeasonFilter() {
  const { season, setSeason } = useFilters();
  const { t } = useTranslation('filters');

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('season')}</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(Season).map((s) => {
          const Icon = seasonIcons[s];
          const isActive = season === s;
          return (
            <Button key={s} variant={isActive ? 'default' : 'outline'} size="sm" className={`justify-start gap-2.5 rounded-lg h-9 ${isActive ? 'shadow-sm' : 'hover:bg-accent'}`} onClick={() => setSeason(isActive ? undefined : s)}>
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{t(`seasons.${s}`)}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
