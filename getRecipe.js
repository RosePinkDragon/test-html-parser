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

const getUrlData = async (req, res) => {
  console.log("here");
  try {
    console.log(req.query);
    const html = await fetch(req.query.url).then((x) => x.text());
    const $ = await cheerio.load(html);
    let results = [];
    var items = $('script[type="application/ld+json"]').toArray();
    items.forEach((item) => {
      const parsedData = JSON.parse(item.firstChild.data);
      if (Array.isArray(parsedData)) {
        return console.log("data is array figure this out");
      }
      if (isGraphSchema(parsedData)) {
        return results.push(isGraphSchema(parsedData));
      }
      if (isRecipeSchema(parsedData)) {
        return results.push(parsedData);
      }
    });
    res.send({ success: true, recipe: results });
  } catch (e) {
    console.log(e.message);
    res.send({ success: false, error: e.message });
  }
};
export default getUrlData;
