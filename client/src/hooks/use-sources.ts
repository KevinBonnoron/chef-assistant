import { config } from '@/lib/config';
import type { SourcePluginMeta } from '@chef-assistant/shared';
import { useEffect, useState } from 'react';

export function useSources() {
  const [sources, setSources] = useState<SourcePluginMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${config.server.url}/scrape`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch sources');
        }

        return res.json();
      })
      .then((data: SourcePluginMeta[]) => {
        if (!cancelled) {
          setSources(data);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { sources, loading, error };
}
