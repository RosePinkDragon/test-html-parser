import mongoose from "mongoose";

const recipeSchema = mongoose.Schema(
  {
    recipe: {},
  },
  {
    timestamp: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
