import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCart } from '@/contexts/cart-context';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { ShoppingBasket, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ShoppingShelfGroup } from './shopping-shelf-group';

export function ShoppingListDialog() {
  const { t } = useTranslation();
  const { selectedRecipeIds } = useCart();
  const { groups, totalItems } = useShoppingList(selectedRecipeIds);

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-11 w-11 shrink-0 rounded-xl">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold rounded-full">{totalItems}</Badge>}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('shoppingList')}</TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-lg max-h-[90vh] rounded-2xl flex flex-col" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <ShoppingBasket className="h-5 w-5 text-primary" />
            {t('shoppingList')}
            {totalItems > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {totalItems}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 h-[calc(90vh-8rem)]">
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm">{t('emptyCart')}</p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={groups.map((g) => g.shelfId || g.shelfName)}>
              {groups.map((group) => (
                <AccordionItem key={group.shelfId || group.shelfName} value={group.shelfId || group.shelfName}>
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    <span className="flex items-center gap-2">
                      {group.shelfName}
                      <Badge variant="secondary" className="rounded-full text-[10px] h-5 min-w-5 px-1.5">
                        {group.items.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ShoppingShelfGroup items={group.items} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
