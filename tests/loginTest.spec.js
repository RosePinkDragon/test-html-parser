import datasplit from "../index.js";
import { vadaPav, vadaPavUrl } from "../samples/testOutput/testResult";

test("string with a single number should result in the number itself", async () => {
  const data = await datasplit(vadaPavUrl);
  console.log(data);
  expect(data).toBe(vadaPav);
});
