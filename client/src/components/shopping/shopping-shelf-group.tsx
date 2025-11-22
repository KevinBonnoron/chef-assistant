import type { ShoppingItem } from '@/hooks/use-shopping-list';

type ShoppingShelfGroupProps = {
  items: ShoppingItem[];
};

export function ShoppingShelfGroup({ items }: ShoppingShelfGroupProps) {
  return (
    <ul className="divide-y divide-border/40">
      {items.map((item) => (
        <li key={item.ingredientId} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
          <span className="text-sm">{item.name}</span>
          {(item.quantity || item.unit) && (
            <span className="text-sm text-muted-foreground tabular-nums ml-4 shrink-0">
              {item.quantity} {item.unit}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
