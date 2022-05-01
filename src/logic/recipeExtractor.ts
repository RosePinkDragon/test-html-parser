import * as cheerio from 'cheerio';
import { RecipeInterface } from '@server/controllers/recipe';

const isRecipeSchema = (data) => {
  if (data['@type']) {
    // check if valid
    if (Array.isArray(data['@type'])) {
      //check if array
      if (data['@type'].includes('Recipes')) return true;
      if (data['@type'].includes('recipes')) return true;
    } else if (data['@type'].toLowerCase() === 'recipe') {
      // check if recipe
      return true;
    }
  }
  return false;
};

const isGraphSchema = (data) => {
  let result = false;
  if (data['@graph']) {
    data['@graph'].forEach((element) => {
      if (isRecipeSchema(element)) result = element;
    });
  }
  return result;
};

const queryExtractor = async (url) => {
  // import fetch from 'node-fetch';
  const { default: fetch } = await import('node-fetch');
  const html = await fetch(url).then((x) => x.text());
  const $ = cheerio.load(html);
  const results = [];
  const items = $('script[type="application/ld+json"]').toArray();
  items.forEach((item) => {
    // console.log(JSON.parse(item.firstChild.data));
    const parsedData = JSON.parse(item.firstChild as any).data;
    if (Array.isArray(parsedData)) {
      return parsedData.forEach((data) => {
        if (isRecipeSchema(data)) results.push(data);
      });
    }
    if (isGraphSchema(parsedData)) {
      return results.push(isGraphSchema(parsedData));
    }
    if (isRecipeSchema(parsedData)) {
      return results.push(parsedData);
    }
  });
  return results;
};

const stepsExtractor = (recipeInstructions) => {
  const minInstructions = {};
  recipeInstructions.forEach((instruction, idx) => {
    const name = instruction.name;
    if (instruction['@type'] === 'HowToSection') {
      const innerInsArr = instruction.itemListElement.map((innerIns) => {
        return innerIns.text;
      });
      return (minInstructions[name] = innerInsArr);
    }
    if (instruction['@type'] === 'HowToStep') {
      return (minInstructions[name || `Step ${idx + 1}`] = instruction.text);
    }
  });
  return minInstructions;
};

const extractRecipes = async (recipeUrl: string): Promise<RecipeInterface> => {
  const recipeData: RecipeInterface = {
    error: true,
    recipe: {
      name: '',
      author: '',
      description: '',
      image: [],
      recipeYeild: '',
      prepTime: '',
      cookTime: '',
      totalTime: '',
      recipeIngredients: [],
      recipeCategory: '',
      recipeCuisine: '',
      aggregateRating: {
        ratingCount: '',
        ratingValue: '',
      },
      ratingCount: '',
      instructions: {},
    },
  };
  try {
    const extractedRecipes = await queryExtractor(recipeUrl);
    const initialData = extractedRecipes[0];
    if (!initialData) throw Error('Unable to extract Recipe');
    const minifiedInstructions = stepsExtractor(initialData.recipeInstructions);
    // imageUploader(initialData.image, initialData.name);
    recipeData.recipe = {
      name: initialData.name,
      author: initialData.author,
      description: initialData.description,
      image: initialData.image,
      recipeYeild: initialData.recipeYeild,
      prepTime: initialData.prepTime,
      cookTime: initialData.cookTime,
      totalTime: initialData.totalTime,
      recipeIngredients: initialData.recipeIngredient,
      recipeCategory: initialData.recipeCategory,
      recipeCuisine: initialData.recipeCuisine,
      aggregateRating: initialData.aggregateRating,
      ratingCount: initialData.ratingCount,
      instructions: minifiedInstructions,
    };
    recipeData.error = false;
    return recipeData;
  } catch (error: unknown) {
    return recipeData;
  }
};

export default extractRecipes;
