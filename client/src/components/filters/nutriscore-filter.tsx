import { Button } from '@/components/ui/button';
import { useFilters } from '@/contexts/filters-context';
import { Nutriscore } from '@chef-assistant/shared';
import { useTranslation } from 'react-i18next';

const nutriscoreColors: Record<Nutriscore, string> = {
  [Nutriscore.A]: 'bg-[#0a8e45] text-white hover:bg-[#0a8e45]/80 border-[#0a8e45]',
  [Nutriscore.B]: 'bg-[#7ac547] text-white hover:bg-[#7ac547]/80 border-[#7ac547]',
  [Nutriscore.C]: 'bg-[#fecb02] text-black hover:bg-[#fecb02]/80 border-[#fecb02]',
  [Nutriscore.D]: 'bg-[#ee8100] text-white hover:bg-[#ee8100]/80 border-[#ee8100]',
  [Nutriscore.E]: 'bg-[#e63e11] text-white hover:bg-[#e63e11]/80 border-[#e63e11]',
  [Nutriscore.UNKNOWN]: '',
};

export function NutriscoreFilter() {
  const { nutriscore, setNutriscore } = useFilters();
  const { t } = useTranslation('filters');

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('nutriscore')}</h4>
      <div className="flex gap-2">
        {Object.values(Nutriscore).map((n) => {
          const isActive = nutriscore === n;
          return (
            <Button key={n} variant={isActive ? 'default' : 'outline'} size="sm" className={`h-9 w-9 p-0 rounded-lg font-bold text-xs ${isActive ? nutriscoreColors[n] : 'hover:bg-accent'}`} onClick={() => setNutriscore(isActive ? undefined : n)}>
              {n === 'UNKNOWN' ? '?' : n}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
