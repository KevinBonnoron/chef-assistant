import { Category, Nutriscore, Season, Source } from '@chef-assistant/shared';
import { parseAsInteger, parseAsString, parseAsStringEnum, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { createContext, type ReactNode, useCallback, useContext, useMemo } from 'react';

const filtersParsers = {
  source: parseAsStringEnum<Source>(Object.values(Source)).withDefault(Source.MANGER_BOUGER),
  season: parseAsStringEnum<Season>(Object.values(Season)),
  category: parseAsStringEnum<Category>(Object.values(Category)),
  nutriscore: parseAsStringEnum<Nutriscore>(Object.values(Nutriscore)),
  query: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
  page: parseAsInteger.withDefault(1),
};

type FiltersContextValue = {
  source: Source;
  season?: Season;
  category?: Category;
  nutriscore?: Nutriscore;
  query: string;
  sortDirection: 'asc' | 'desc';
  page: number;
  setSource: (source: Source) => void;
  setSeason: (season?: Season) => void;
  setCategory: (category?: Category) => void;
  setNutriscore: (nutriscore?: Nutriscore) => void;
  setQuery: (query: string) => void;
  toggleSort: () => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
  activeFilterCount: number;
};

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useQueryStates(filtersParsers, {
    history: 'push',
  });

  const setSource = useCallback((source: Source) => setState({ source, page: 1 }), [setState]);
  const setSeason = useCallback((season?: Season) => setState({ season: season ?? null, page: 1 }), [setState]);
  const setCategory = useCallback((category?: Category) => setState({ category: category ?? null, page: 1 }), [setState]);
  const setNutriscore = useCallback((nutriscore?: Nutriscore) => setState({ nutriscore: nutriscore ?? null, page: 1 }), [setState]);
  const setQuery = useCallback((newQuery: string) => setState((prev) => {
    if (prev.query === newQuery) { return {}; }
    return { query: newQuery, page: 1 };
  }), [setState]);
  const toggleSort = useCallback(() => setState((prev) => ({ sort: prev.sort === 'asc' ? 'desc' : 'asc' })), [setState]);
  const setPage = useCallback((page: number) => setState({ page }), [setState]);
  const clearFilters = useCallback(() => setState({ season: null, category: null, nutriscore: null, sort: 'desc', page: 1 }), [setState]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (state.season) { count++; }
    if (state.category) { count++; }
    if (state.nutriscore) { count++; }
    return count;
  }, [state.season, state.category, state.nutriscore]);

  const value = useMemo<FiltersContextValue>(
    () => ({
      source: state.source,
      season: state.season ?? undefined,
      category: state.category ?? undefined,
      nutriscore: state.nutriscore ?? undefined,
      query: state.query,
      sortDirection: state.sort,
      page: state.page,
      setSource,
      setSeason,
      setCategory,
      setNutriscore,
      setQuery,
      toggleSort,
      setPage,
      clearFilters,
      activeFilterCount,
    }),
    [state, setSource, setSeason, setCategory, setNutriscore, setQuery, toggleSort, setPage, clearFilters, activeFilterCount],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return ctx;
}
