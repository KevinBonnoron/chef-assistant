import { ScrapeSection } from '@/components/admin/scrape-section';
import { createFileRoute } from '@tanstack/react-router';
import { Plug } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
        <p className="mt-1 text-muted-foreground">Gérer les sources de recettes (plugins) et l’import.</p>
      </div>

      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Plug className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Sources & import</h2>
            <p className="text-sm text-muted-foreground">Choisissez une source puis lancez le scraping pour importer des recettes.</p>
          </div>
        </div>
        <ScrapeSection />
      </section>
    </div>
  );
}
