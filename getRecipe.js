import fetch from "node-fetch";
import cheerio from "cheerio";

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
  const $ = await cheerio.load(html);
  let results;
  var items = $('script[type="application/ld+json"]').toArray();
  items.forEach((item) => {
    const parsedData = JSON.parse(item.firstChild.data);
    if (Array.isArray(parsedData)) {
      console.log("data is array figure this out");
      return (results = false);
    }
    if (isGraphSchema(parsedData)) {
      return (results = isGraphSchema(parsedData));
    }
    if (isRecipeSchema(parsedData)) {
      return (results = parsedData);
    }
  });
  return results;
};

const stepsExtractor = (recipeInstructions) => {
  let minInstructions = {};
  recipeInstructions.forEach((instruction) => {
    const name = instruction.name;
    if (instruction["@type"] === "HowToSection") {
      const innerInsArr = instruction.itemListElement.map((innerIns) => {
        return innerIns.text;
      });
      minInstructions[name] = innerInsArr;
    }
    if (instruction["@type"] === "HowToStep") {
      minInstructions[name] = instruction.text;
    }
  });
  return minInstructions;
};

const getUrlData = async (req, res) => {
  try {
    const initialData = await queryExtractor(req.query.url);
    const minifiedInstructions = stepsExtractor(initialData.recipeInstructions);
    res.send({ success: true, recipe: minifiedInstructions });
  } catch (e) {
    console.log(e.message);
    res.send({ success: false, error: e.message });
  }
};
export default getUrlData;
