import puppeteer from "puppeteer";

//segregate the schema
function getRecipeFromSimpleSchema(schema) {
  //?? key is the index
  for (var key in schema) {
    if (schema.hasOwnProperty(key)) {
      const isContainingRecipe = () => {
        if (schema[key]["@type"]) {
          // check if valid
          if (schema[key]["@type"].toLowerCase() === "recipe") {
            // check if recipe
            return true;
          } else if (Array.isArray(schema[key]["@type"])) {
            //check if array
            if (schema[key]["@type"].includes("Recipes")) return true;
            if (schema[key]["@type"].includes("recipes")) return true;
          }
        }
        return false;
      };
      if (isContainingRecipe) {
        return schema[key];
      }
    }
  }
}

const getSchema = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const schema = await page.evaluate(() => {
      let results = [];
      const yoastSchema = document.querySelectorAll(
        `script[type="application/ld+json"].yoast-schema-graph`
      );
      if (yoastSchema.length > 0) {
        yoastSchema.forEach((item) => {
          results.push(JSON.parse(item.innerText));
        });
        return { type: "yoast-schema-graph", results };
      } else {
        document
          .querySelectorAll(`script[type="application/ld+json"]`)
          .forEach((item) => {
            results.push(JSON.parse(item.innerText));
          });
        return { type: "default", results };
      }
    });
    browser.close();
    return schema;
  } catch (e) {
    console.log(e);
  }
};

const getRecipeData = async (url) => {
  try {
    const schemaDetails = await getSchema(url);
    if (schemaDetails.type === "default") {
      return getRecipeFromSimpleSchema(schemaDetails.results);
    }
  } catch (error) {
    console.log(error);
  }
};

export default getRecipeData;
