import type { Category } from './category.type';
import type { Nutriscore } from './nutriscore.type';
import type { Season } from './season.type';
import type { Source } from './source.type';

export type Recipe = {
  id: string;
  name: string;
  slug: string;
  source: Source;
  image?: string;
  preparationTime: number;
  bakingTime: number;
  restTime: number;
  seasons: Season[];
  category: Category;
  nutriscore: Nutriscore;
  tags: string[];
};
