import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSources } from '@/hooks/use-sources';
import { config } from '@/lib/config';
import type { SourceOption, SourcePluginMeta } from '@chef-assistant/shared';
import { Download, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function getOptionValue(options: SourceOption[] | undefined, key: string, values: Record<string, string>): string {
  if (!options?.some((o) => o.key === key)) {
    return '';
  }
  return values[key] ?? '';
}

export function ScrapeSection() {
  const { sources, loading: sourcesLoading, error: sourcesError } = useSources();
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [optionValues, setOptionValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ fetched: number; saved: number; skipped: number } | null>(null);

  useEffect(() => {
    if (sources.length > 0 && !selectedSource) {
      setSelectedSource(sources[0].id);
    }
  }, [sources, selectedSource]);

  const currentSource = sources.find((s) => s.id === selectedSource) ?? sources[0];

  const handleScrape = async () => {
    const sourceId = currentSource?.id;
    if (!sourceId) {
      return;
    }

    setLoading(true);
    setResult(null);

    const body: Record<string, number> = {};
    for (const opt of currentSource?.options ?? []) {
      const v = optionValues[opt.key];
      if (v !== undefined && v !== '') {
        const n = Number.parseInt(v, 10);
        if (!Number.isNaN(n)) {
          body[opt.key] = n;
        }
      }
    }

    try {
      const response = await fetch(`${config.server.url}/scrape/${sourceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? `Erreur ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      toast.success(`${data.saved} recettes importées depuis ${sourceId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du scraping');
    } finally {
      setLoading(false);
    }
  };

  if (sourcesLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement des sources...
      </div>
    );
  }

  if (sourcesError) {
    return <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">Impossible de charger les sources : {sourcesError}</div>;
  }

  if (sources.length === 0) {
    return <p className="text-muted-foreground">Aucune source de recettes enregistrée.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sources.map((s: SourcePluginMeta) => (
            <Button
              key={s.id}
              variant={selectedSource === s.id ? 'default' : 'outline'}
              className="h-auto flex-col items-start gap-0.5 rounded-xl px-3 py-2.5"
              onClick={() => {
                setSelectedSource(s.id);
                setResult(null);
              }}
              disabled={loading}
            >
              <span className="text-sm font-medium">{s.label}</span>
              <span className={`text-[10px] ${selectedSource === s.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{s.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {currentSource?.options?.map((opt) => (
        <div key={opt.key} className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {opt.label}
            {opt.optional && <span className="ml-1 normal-case font-normal">(vide = par défaut)</span>}
          </label>
          <Input type="number" min={1} placeholder={opt.description ?? ''} value={getOptionValue(currentSource.options, opt.key, optionValues)} onChange={(e) => setOptionValues((prev) => ({ ...prev, [opt.key]: e.target.value }))} className="rounded-xl" disabled={loading} />
        </div>
      ))}

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

      <Button className="h-11 w-full rounded-xl" onClick={handleScrape} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scraping en cours...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Lancer le scraping
          </>
        )}
      </Button>
    </div>
  );
}
