import express from "express";
import { PORT, MONGO_URL, HEALTH_CHECK } from "./config.js";
import getUrlData from "./getRecipe.js";
import cors from "cors";
import mongoose from "mongoose";
import { requireUser } from "./middleware/checkUser.js";

const app = express();

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.log({
      error: err.message || "There was an error",
    });
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(HEALTH_CHECK, (_req, res) => {
  res.send({ success: true });
});

app.post("/getRecipe", requireUser, getUrlData);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
