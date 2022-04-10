import mongoose from "mongoose";
import isURL from "validator/lib/isURL.js";

const recipeSchema = mongoose.Schema(
  {
    recipeUrl: {
      unique: true,
      type: String,
      required: [true, "Please Enter a URL"],
      validate: [isURL, "Invalid URL"],
    },
    status: {
      type: String,
      default: "IN-PROCESS",
      enum: {
        values: ["SUCCESS", "IN-PROCESS", "FAILED"],
        message: "{VALUE} is not supported",
      },
      required: [true, "Please Enter a valid status"],
    },
    recipe: {},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamp: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
