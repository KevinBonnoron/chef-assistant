import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { config } from '@/lib/config';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Source = 'manger-bouger' | 'marmiton';

const sources: { value: Source; label: string; description: string }[] = [
  { value: 'manger-bouger', label: 'Manger Bouger', description: 'API GraphQL officielle' },
  { value: 'marmiton', label: 'Marmiton', description: 'Scraping HTML des recettes' },
];

export function ScrapeDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source>('manger-bouger');
  const [maxPage, setMaxPage] = useState('');
  const [limit, setLimit] = useState('');
  const [result, setResult] = useState<{ fetched: number; saved: number; skipped: number } | null>(null);

  const handleScrape = async () => {
    setLoading(true);
    setResult(null);

    const body: Record<string, number> = {};
    if (selectedSource === 'manger-bouger' && maxPage) {
      body.maxPage = Number.parseInt(maxPage);
    }
    if (selectedSource === 'marmiton' && limit) {
      body.limit = Number.parseInt(limit);
    }

    try {
      const response = await fetch(`${config.server.url}/scrape/${selectedSource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Erreur ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      toast.success(`${data.saved} recettes importées depuis ${selectedSource}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du scraping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setResult(null);
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
              <Download className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Importer des recettes</TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <Download className="h-5 w-5 text-primary" />
            Importer des recettes
          </DialogTitle>
          <DialogDescription>Scraper des recettes depuis une source externe et les sauvegarder dans la base.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source</label>
            <div className="grid grid-cols-2 gap-2">
              {sources.map((s) => (
                <Button
                  key={s.value}
                  variant={selectedSource === s.value ? 'default' : 'outline'}
                  className="h-auto flex-col items-start gap-0.5 rounded-xl px-3 py-2.5"
                  onClick={() => {
                    setSelectedSource(s.value);
                    setResult(null);
                  }}
                  disabled={loading}
                >
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className={`text-[10px] ${selectedSource === s.value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{s.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {selectedSource === 'manger-bouger' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pages max <span className="normal-case font-normal">(vide = toutes)</span>
              </label>
              <Input type="number" min={1} placeholder="Toutes les pages" value={maxPage} onChange={(e) => setMaxPage(e.target.value)} className="rounded-xl" disabled={loading} />
            </div>
          )}

          {selectedSource === 'marmiton' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Limite de recettes <span className="normal-case font-normal">(vide = illimité)</span>
              </label>
              <Input type="number" min={1} placeholder="Pas de limite" value={limit} onChange={(e) => setLimit(e.target.value)} className="rounded-xl" disabled={loading} />
            </div>
          )}

          {result && (
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3 text-sm">
              <span>Terminé :</span>
              <Badge variant="default" className="rounded-full">
                {result.saved} importées
              </Badge>
              {result.skipped > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {result.skipped} ignorées
                </Badge>
              )}
            </div>
          )}

          <Button className="w-full rounded-xl h-11" onClick={handleScrape} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scraping en cours...
              </>
            ) : (
              'Lancer le scraping'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
