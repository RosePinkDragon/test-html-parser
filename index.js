import express from "express";
import { PORT } from "./config.js";
import getUrlData from "./getRecipe.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/hello", (req, res) => {
  res.send({ success: true });
});

app.use("/getRecipe", getUrlData);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
