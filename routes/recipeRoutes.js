import express from "express";
import {
  addUserToRecipe,
  getUrlData,
} from "../controllers/recipeControllers.js";

const router = express.Router();

router.get("/add-recipe-to-user/:id", addUserToRecipe);
router.post("/get-recipe", getUrlData);

export default router;
