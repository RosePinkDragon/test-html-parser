import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import recipeRoutes from "./routes/recipeRoutes.js";
import { requireUser } from "./middleware/checkUser.js";
import { PORT, MONGO_URL, HEALTH_CHECK } from "./config.js";

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

app.use("/recipe", requireUser, recipeRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
