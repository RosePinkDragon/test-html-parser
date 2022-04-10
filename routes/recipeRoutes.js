import express from "express";
import {
  addUserToRecipe,
  getUrlData,
  getUserRecipes,
} from "../controllers/recipeControllers.js";

const router = express.Router();

router.get("/add-recipe-to-user/:id", addUserToRecipe);
router.get("/get-user-recipes", getUserRecipes);
router.post("/get-recipe", getUrlData);

export default router;
