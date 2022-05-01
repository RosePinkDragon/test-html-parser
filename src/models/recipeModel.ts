import mongoose, { Schema, Document } from 'mongoose';
import isURL from 'validator/lib/isURL.js';

export enum Status {
  success = 'SUCCESS',
  inProcess = 'IN-PROCESS',
  failed = 'FAILED',
}

export interface IRecipeData {
  name: string;
  author: string;
  description: string;
  image: string[];
  recipeYeild: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  recipeIngredients: string[];
  recipeCategory: string;
  recipeCuisine: string;
  aggregateRating: {
    ratingValue: string | number;
    ratingCount: string | number;
  };
  ratingCount: string;
  instructions: Record<string, unknown>;
}

export interface IRecipeSchema extends Document {
  recipeUrl: string;
  status: Status;
  recipe: IRecipeData;
  users: string;
}

const recipeSchema = new Schema(
  {
    recipeUrl: {
      unique: true,
      type: String,
      required: [true, 'Please Enter a URL'],
      validate: [isURL, 'Invalid URL'],
    },
    status: {
      type: String,
      default: 'IN-PROCESS',
      enum: {
        values: Object.values(Status),
        message: '{VALUE} is not supported',
      },
      required: [true, 'Please Enter a valid status'],
    },
    recipe: {},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  {
    timestamps: true,
  },
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
