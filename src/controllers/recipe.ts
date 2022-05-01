import Recipe, { IRecipeData } from '@server/models/recipeModel';
import extractRecipes from '@server/logic/recipeExtractor';
import { Request, Response } from 'express';

export interface RecipeInterface {
  error: boolean;
  recipe: IRecipeData;
}

export interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

export const containsUser = (users: string, userId: string): boolean => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].toString() === userId) {
      return true;
    }
  }
  return false;
};

export const getAllRecipes = async (_req: Request, res: Response): Promise<void> => {
  const recipe = await Recipe.find({ status: 'SUCCESS' });
  if (!recipe || recipe === null) res.status(400).send({ success: false, message: 'Recipe Not Found' });
  res.status(200).send({
    success: true,
    recipes: {
      numberOfRecipes: recipe.length,
      recipe,
    },
  });
};

export const getSingleRecipe = async (req: Request, res: Response): Promise<void> => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe === null) res.status(400).send({ success: false, message: 'Recipe Not Found' });
  res.status(400).send({ success: false, recipe: recipe });
};

export const getUserRecipes = async (_req: Request, res: Response): Promise<void> => {
  const recipe = await Recipe.find({ users: res.locals.user._id });
  res.status(200).send({
    success: true,
    recipes: {
      numberOfRecipes: recipe.length,

      recipe,
    },
  });
};

export const addUserToRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe === null) throw Error('Recipe Not Found');
    if (recipe && containsUser(recipe.users, res.locals.user._id)) {
      throw Error('User Already Exists');
    }
    await Recipe.findOneAndUpdate(
      {
        _id: recipe._id,
      },
      {
        users: [...recipe.users, res.locals.user._id],
      },
      {
        new: true,
      },
    );
    res.status(200).send({ success: true, message: 'Recipe Added Successfully' });
  } catch (error: unknown) {
    if (typeof error === 'string') {
      res.status(400).send({ success: false, error: error || 'User Already Exists' });
    } else if (error instanceof Error) {
      res.status(400).send({ success: false, error: error.message || 'User Already Exists' });
    }
  }
};

export const getUrlData = async (req: Request, res: Response): Promise<void> => {
  try {
    const isRecipeAvailable = await Recipe.findOne({
      recipeUrl: req.query.url,
    });
    if (isRecipeAvailable?.status === 'SUCCESS') {
      res.send({
        success: true,
        recipe: { id: isRecipeAvailable._id, ...isRecipeAvailable.recipe },
      });
    } else {
      const { url } = req.query;
      const recipeData: RecipeInterface = await extractRecipes(url.toString());
      if (recipeData.error) throw Error('Unable To extract Recipe');
      if (isRecipeAvailable) {
        await Recipe.findOneAndUpdate(
          {
            _id: isRecipeAvailable._id,
          },
          {
            recipeUrl: req.query.url,
            status: 'SUCCESS',
            recipe: recipeData.recipe,
          },
          { new: true },
        );
        res.send({
          success: true,
          recipe: {
            id: isRecipeAvailable._id,
            ...isRecipeAvailable.recipe,
          },
        });
      } else {
        const newRecipe = await Recipe.create({
          recipeUrl: req.query.url,
          status: 'SUCCESS',
          recipe: recipeData.recipe,
        });
        res.send({
          success: true,
          recipe: {
            id: newRecipe._id,
            ...newRecipe.recipe,
          },
        });
      }
    }
  } catch (error: unknown) {
    const isAlreadyFailedRecipe = await Recipe.findOne({
      recipeUrl: req.query.url,
    });
    if (!isAlreadyFailedRecipe) {
      await Recipe.create({
        recipeUrl: req.query.url,
        status: 'FAILED',
        recipe: {},
      });
    }
    if (typeof error === 'string') {
      res.send({
        success: false,
        error: error || 'Error Extracting the recipes',
      });
    } else if (error instanceof Error) {
      res.send({
        success: false,
        error: error.message || 'Error Extracting the recipes',
      });
    }
  }
};
