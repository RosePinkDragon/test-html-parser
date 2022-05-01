import express from 'express';
import {
  addUserToRecipe,
  getUrlData,
  getUserRecipes,
  getSingleRecipe,
  getAllRecipes,
} from '@server/controllers/recipe';

const router = express.Router();

router.get('/get-user-recipes', getUserRecipes);
router.get('/get-all-recipes', getAllRecipes);
router.get('/get-single-recipe/:id', getSingleRecipe);
router.get('/add-recipe-to-user/:id', addUserToRecipe);
router.post('/get-recipe', getUrlData);

export default router;
