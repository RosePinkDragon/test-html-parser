import fetch from "node-fetch";
import * as cheerio from "cheerio";

const isRecipeSchema = (data) => {
  // console.log(data);
  if (data["@type"]) {
    // check if valid
    if (Array.isArray(data["@type"])) {
      //check if array
      if (data["@type"].includes("Recipes")) return true;
      if (data["@type"].includes("recipes")) return true;
    } else if (data["@type"].toLowerCase() === "recipe") {
      // check if recipe
      return true;
    }
  }
  return false;
};

const isGraphSchema = (data) => {
  let result = false;
  if (data["@graph"]) {
    data["@graph"].forEach((element) => {
      if (isRecipeSchema(element)) result = element;
    });
  }
  return result;
};

const queryExtractor = async (url) => {
  const html = await fetch(url).then((x) => x.text());
  const $ = cheerio.load(html);
  let results = [];
  var items = $('script[type="application/ld+json"]').toArray();
  items.forEach((item) => {
    const parsedData = JSON.parse(item.firstChild.data);
    if (Array.isArray(parsedData)) {
      return;
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
  let minInstructions = {};
  console.log(recipeInstructions);
  recipeInstructions.forEach((instruction, idx) => {
    const name = instruction.name;
    if (instruction["@type"] === "HowToSection") {
      const innerInsArr = instruction.itemListElement.map((innerIns) => {
        return innerIns.text;
      });
      return (minInstructions[name] = innerInsArr);
    }
    if (instruction["@type"] === "HowToStep") {
      return (minInstructions[name || `Step ${idx + 1}`] = instruction.text);
    }
  });
  console.log(minInstructions);
  return minInstructions;
};

const getUrlData = async (req, res) => {
  try {
    const extractedRecipes = await queryExtractor(req.query.url);
    const initialData = extractedRecipes[0];
    if (!initialData) throw Error("Unable to extract Recipe");
    const minifiedInstructions = stepsExtractor(initialData.recipeInstructions);
    const {
      name,
      author,
      description,
      image,
      recipeYeild,
      prepTime,
      cookTime,
      totalTime,
      recipeIngredient,
      recipeCategory,
      recipeCuisine,
      aggregateRating,
      ratingCount,
    } = initialData;
    res.send({
      success: true,
      recipe: {
        name,
        author,
        description,
        image,
        recipeYeild,
        prepTime,
        cookTime,
        totalTime,
        recipeIngredient,
        recipeCategory,
        recipeCuisine,
        aggregateRating,
        ratingCount,
        minifiedInstructions,
      },
    });
  } catch (e) {
    console.log(e);
    console.log(e.message);
    res.send({ success: false, error: e.message });
  }
};
export default getUrlData;
