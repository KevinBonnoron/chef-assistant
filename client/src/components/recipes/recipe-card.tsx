import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Recipe } from '@chef-assistant/shared';
import { Clock, Eye, Heart, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RecipeCardProps = {
  recipe: Recipe;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: () => void;
  onToggleCart: () => void;
  onViewDetail: () => void;
};

export function RecipeCard({ recipe, isFavorite, isInCart, onToggleFavorite, onToggleCart, onViewDetail }: RecipeCardProps) {
  const { t } = useTranslation();
  const totalTime = (recipe.preparationTime ?? 0) + (recipe.bakingTime ?? 0);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Image — clickable */}
      <button type="button" className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer" onClick={onViewDetail}>
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
            <span className="text-5xl opacity-60">🍽️</span>
          </div>
        )}

        {/* Time badge overlay */}
        {totalTime > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm shadow-sm">
            <Clock className="h-3 w-3 text-primary" />
            <span>
              {totalTime} {t('minutes')}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/5" />
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug cursor-default">{recipe.name}</h3>
          </TooltipTrigger>
          <TooltipContent side="bottom">{recipe.name}</TooltipContent>
        </Tooltip>

        {/* Action buttons */}
        <div className="mt-auto flex items-center gap-1 -mx-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={onViewDetail}>
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('detail')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg transition-colors ${isInCart ? 'bg-primary/15 text-primary hover:bg-primary/25' : 'hover:bg-primary/10 hover:text-primary'}`} onClick={onToggleCart}>
                <ShoppingCart className={`h-4 w-4 ${isInCart ? 'fill-current' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isInCart ? t('removeFromCart') : t('addToCart')}</TooltipContent>
          </Tooltip>

          <div className="flex-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg transition-colors ${isFavorite ? 'text-red-500 hover:bg-red-500/10' : 'hover:bg-red-500/10 hover:text-red-500'}`} onClick={onToggleFavorite}>
                <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-current scale-110' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFavorite ? t('removeFromFavorites') : t('addToFavorites')}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
