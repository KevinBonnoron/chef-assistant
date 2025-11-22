import { PantryView } from '@/components/pantry/pantry-view';
import { PantryProvider } from '@/contexts/pantry-context';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pantry')({
  component: PantryPage,
});

function PantryPage() {
  return (
    <PantryProvider>
      <PantryView />
    </PantryProvider>
  );
}
