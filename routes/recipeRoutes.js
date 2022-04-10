import express from "express";
import {
  addUserToRecipe,
  getUrlData,
  getUserRecipes,
  getSingleRecipe,
} from "../controllers/recipeControllers.js";

const router = express.Router();

router.get("/get-user-recipes", getUserRecipes);
router.get("/get-single-recipe/:id", getSingleRecipe);
router.get("/add-recipe-to-user/:id", addUserToRecipe);
router.post("/get-recipe", getUrlData);

export default router;
