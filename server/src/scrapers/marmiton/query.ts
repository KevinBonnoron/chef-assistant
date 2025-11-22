import { Category } from '@chef-assistant/shared';
import { parse } from 'node-html-parser';
import { capitalizeFirstLetter } from '../../utils';
import type { MarmitonQueryResponse } from './types';

const parsedUrls = new Set<string>();

function cleanText(text?: string) {
  if (!text) {
    return '';
  }

  return text
    .replace(/^[\s]+/gm, '')
    .replace(/[\s]+$/gm, '')
    .replace(/[\n]*/gm, '');
}

function parseTime(text?: string) {
  let time = 0;
  if (!text) {
    return time;
  }

  const [, minutes] = text.match(/([0-9]+) min/) ?? [];
  if (minutes) {
    time += Number.parseInt(minutes);
  }

  const [, hours] = text.match(/([0-9]+) h/) ?? [];
  if (hours) {
    time += Number.parseInt(hours) * 60;
  }

  return time;
}

function parseCategory(text?: string): Category {
  if (!text) {
    return Category.UNKNOWN;
  }

  if (text.toLowerCase().includes('plat principal')) {
    return Category.MAIN_COURSE;
  }

  if (text.toLowerCase().includes('dessert')) {
    return Category.DESSERT;
  }

  if (text.toLowerCase().includes('entrée') || text.toLowerCase().includes('salade') || text.toLowerCase().includes('apéritif') || text.toLowerCase().includes('amuse-gueule')) {
    return Category.STARTER;
  }

  if (text.toLowerCase().includes('boisson') || text.toLowerCase().includes('cocktail')) {
    return Category.DRINK;
  }

  if (text.toLowerCase().includes('sauces')) {
    return Category.SAUCE;
  }

  if (text.toLowerCase().includes('accompagnement')) {
    return Category.SIDE_DISH;
  }

  return Category.UNKNOWN;
}

export function resetParsedUrls() {
  parsedUrls.clear();
}

export async function queryMarmiton(url: string): Promise<MarmitonQueryResponse | undefined> {
  if (parsedUrls.has(url)) {
    return;
  }

  parsedUrls.add(url);

  const response = await fetch(url);
  const doc = parse(await response.text());

  const slug = url.replace('https://www.marmiton.org/recettes/', '').replace('.aspx', '');
  const image = (doc.querySelector('img.recipe-media-viewer-picture')?.getAttribute('data-srcset') ?? '').split('\n')[0]?.split(' ')[0] ?? '';
  let category = parseCategory(cleanText(doc.querySelector('.af-bread-crumb')?.textContent));
  if (category === Category.UNKNOWN) {
    category = parseCategory(cleanText(doc.querySelector('div.modal__tags > span:nth-child(2)')?.textContent));
  }

  const name = cleanText(doc.querySelector('div.main-title h1')?.textContent);
  const ingredients = doc.querySelectorAll('span.card-ingredient-title').map((span) => {
    const name = capitalizeFirstLetter(cleanText(span.querySelector('.ingredient-name')?.textContent));
    const quantityString = cleanText(span.querySelector('.card-ingredient-quantity .count')?.textContent);
    const unitString = cleanText(span.querySelector('.card-ingredient-quantity .unit')?.textContent);
    const quantity = quantityString === '' ? null : Number.parseInt(quantityString);
    const unit = unitString === '' ? null : unitString;

    return {
      name,
      quantity,
      unit,
      storeShelf: '',
    };
  });

  const steps = doc
    .querySelectorAll('div.recipe-step-list__container')
    .map((div) => ({
      order: Number.parseInt(cleanText(div.querySelector('div.recipe-step-list__head > span')?.textContent.replace('Étape ', '') ?? '0')),
      text: cleanText(div.querySelector('p')?.textContent),
    }))
    .filter((step) => step.text !== '')
    .map((step, i) => ({ ...step, order: i + 1 }));

  const preparationTime = parseTime(cleanText(doc.querySelector('div.time__details > div:nth-child(1)')?.textContent.replace('Préparation :', '')));
  const bakingTime = parseTime(cleanText(doc.querySelector('div.time__details > div:nth-child(3)')?.textContent.replace('Cuisson :', '')));

  const recipe = {
    id: slug.replace('recette_', '').split('_')[1],
    slug,
    name,
    ingredients,
    steps,
    preparationTime,
    bakingTime,
    image,
    category,
  };

  const links: string[] = doc
    .querySelectorAll('.seo-links-tag-page-items > ul > li')
    .map((li) => li.querySelector('a')?.getAttribute('href') ?? '')
    .filter((link) => link.endsWith('.aspx'))
    .filter((link) => !parsedUrls.has(link));

  return { recipe, links };
}
