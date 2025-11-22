import { Button } from '@/components/ui/button';
import { useFilters } from '@/contexts/filters-context';
import { Category } from '@chef-assistant/shared';
import { Beef, CircleDot, Droplet, GlassWater, IceCreamCone, Salad, Soup, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const categoryIcons = {
  [Category.STARTER]: Soup,
  [Category.FULL_COURSE]: Beef,
  [Category.MAIN_COURSE]: Utensils,
  [Category.SIDE_DISH]: Salad,
  [Category.DESSERT]: IceCreamCone,
  [Category.SAUCE]: Droplet,
  [Category.DRINK]: GlassWater,
  [Category.OTHER]: CircleDot,
  [Category.UNKNOWN]: CircleDot,
} as const;

export function CategoryFilter() {
  const { category, setCategory } = useFilters();
  const { t } = useTranslation('filters');

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('category')}</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(Category).map((c) => {
          const Icon = categoryIcons[c];
          const isActive = category === c;
          return (
            <Button key={c} variant={isActive ? 'default' : 'outline'} size="sm" className={`justify-start gap-2.5 rounded-lg h-9 ${isActive ? 'shadow-sm' : 'hover:bg-accent'}`} onClick={() => setCategory(isActive ? undefined : c)}>
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{t(`categories.${c}`)}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
