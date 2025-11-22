export enum Source {
  MANGER_BOUGER = 'MANGER_BOUGER',
  MARMITON = 'MARMITON',
  CUSTOM = 'CUSTOM',
}

/** Option field for a scraper source (e.g. maxPage, limit) */
export type SourceOption = {
  key: string;
  label: string;
  description?: string;
  type: 'number';
  optional?: boolean;
};

/** Metadata for a registered scraper source (plugin-like) */
export type SourcePluginMeta = {
  id: string;
  label: string;
  description: string;
  options?: SourceOption[];
};
