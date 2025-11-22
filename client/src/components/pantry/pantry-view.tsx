import { Separator } from '@/components/ui/separator';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Refrigerator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IngredientSelector } from './ingredient-selector';
import { PantryResults } from './pantry-results';

export function PantryView() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/" className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <Refrigerator className="h-5 w-5 text-primary" />
            {t('pantryTitle')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t('pantrySubtitle')}</p>
        </div>
      </div>

      <Separator />

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Left: Ingredient selector */}
        <div className="rounded-xl border bg-card p-4">
          <IngredientSelector />
        </div>

        {/* Right: Results */}
        <div>
          <PantryResults />
        </div>
      </div>
    </div>
  );
}
