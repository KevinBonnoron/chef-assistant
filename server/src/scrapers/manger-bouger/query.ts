import type { MangerBougerQueryResponse } from './types';

const apiUrl = 'https://api-prod-fam.mangerbouger.fr/graphql';
const headers = {
  'Content-Type': 'application/json',
  Authorization:
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS1wcm9kLWZhbS5tYW5nZXJib3VnZXIuZnIvZ3JhcGhxbCIsImlhdCI6MTc0NjY0NDEwMCwiZXhwIjoxNzQ2NjQ3NzAwLCJuYmYiOjE3NDY2NDQxMDAsImp0aSI6IkZEdXJFSGpOeVpQeGVHRUQiLCJzdWIiOiI4NTA2OTQiLCJwcnYiOiI3ODEyOGUwYmJmMzIwMTUyNGUwYWM1YjBlODk1YzAyOWYyNjdjZTVjIiwiYW5vbnltb3VzIjp0cnVlfQ.OKJBc_X91Det79LoFH-2wBZSC4IibCZem3DTRPx5tYg',
};

const recipeSearchQuery = `
  query recipeSearch($express: Boolean, $type: [RecipeCategory!], $regime: Regime, $first: Int!, $page: Int, $query: String) {
    recipeSearch(first: $first, page: $page, regime: $regime, type: $type, express: $express, query: $query) {
      data {
        ...famRecipe
      }
      paginatorInfo {
        hasMorePages
      }
    }
  }

  fragment famRecipe on Recipe {
    id
    name
    slug
    preparation_time
    baking_time
    rest_time
    benefits
    portions
    min_portions
    max_portions
    main_component
    unbreakable
    image
    image_alt
    cover_desktop
    cover_mobile
    cover_alt
    video {
      ...famVideo
    }
    publication_platforms
    published
    archived
    recipe_category
    ranking
    seasons
    express
    nutriscore
    kcal_per_100_g
    kj_per_100_g
    lipids_per_100_g
    saturated_fatty_acids_per_100_g
    carbohydrates_per_100_g
    simple_sugars_per_100_g
    fibres_per_100_g
    salt_per_100_g
    pnns_fruit_per_100_g
    pnns_vegetable_per_100_g
    oils_per_100_g
    pnns_nuts_per_100_g
    pnns_dried_vegetable_per_100_g
    proteins_per_100_g
    family_recipe
    parent
    tags {
      name
      type
    }
    steps {
      order
      text
      image
      image_alt
      family_profile
      video {
        ...famVideo
      }
      ingredients {
        ...famIngredientStep
      }
    }
    ingredients {
      ...famIngredientRecipe
    }
    children_recipes {
      id
      slug
      name
      image
      recipe_category
      ranking
      steps {
        order
        text
        image
        image_alt
        family_profile
        video {
          ...famVideo
        }
        ingredients {
          ...famIngredientStep
        }
      }
    }

  }

  fragment famIngredientStep on Ingredient {
    ...famIngredient
    ingredient_recipe_step {
      quantity
      measurement_unit {
        name
        plural
        use_ingredient_name
      }
      gross_weight
    }
  }

  fragment famIngredient on Ingredient {
    name
    display_name
    display_plural
    plural
    frozen_or_canned
    seasons
    with_pork
    unbreakable
    ignore_shopping_list
    store_shelf {
      name
    }
  }

  fragment famIngredientRecipe on Ingredient {
    ...famIngredient
    ingredient_recipe {
      quantity
      measurement_unit {
        name
        plural
        use_ingredient_name
        round_type
      }
      gross_weight
    }
  }

  fragment famVideo on Video {
    file
    poster
    transcript
  }
`;

export async function queryMangerBouger(first = 0, page = 1): Promise<MangerBougerQueryResponse> {
  const query = {
    operationName: 'recipeSearch',
    variables: {
      query: null,
      first,
      page,
      express: null,
      type: null,
      regime: 'ALL',
    },
    query: `${recipeSearchQuery}`,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(query),
    headers,
  });
  return await response.json();
}
