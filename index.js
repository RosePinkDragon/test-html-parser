// const puppeteer = require("puppeteer");
// async function run() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
//       await page.goto(
//         "https://m.recipes.timesofindia.com/recipes/mumbai-style-vada-pav/rs80920657.cms"
//       );
//       let urls = await page.evaluate(() => {
//         let results = [];
//         let items = document.querySelectorAll(
//           `script[type="application/ld+json"]`
//         );
//         items.forEach((item) => {
//           results.push(JSON.parse(item.innerText));
//         });
//         return results;
//       });
//       browser.close();
//       return resolve(urls);
//     } catch (e) {
//       return reject(e);
//     }
//   });
// }

const data = require("./toi");

function walk(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      const isRecipe =
        (obj[key]["@type"] !== undefined && obj[key]["@type"].toLowerCase()) ===
        "recipe";
      if (isRecipe) {
        console.log(obj[key]);
      }
    }
  }
}

const datasplit = async () => {
  // const res = await run();
  // console.log(res);
  walk(data);
};

datasplit();
