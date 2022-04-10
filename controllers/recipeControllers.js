import Recipe from "../models/recipeModel.js";
import extractRecipes from "../utils/recipeExtracter.js";

export const containsUser = (users, userId) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].toString() === userId) {
      return true;
    }
  }
  return false;
};

export const getSingleRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe === null)
    res.status(400).send({ success: false, message: "Recipe Not Found" });
  res.status(400).send({ success: false, recipe: recipe });
};

export const getUserRecipes = async (_req, res) => {
  const recipe = await Recipe.find({ users: res.locals.user._id });
  res.status(200).send({
    success: true,
    recipes: {
      numberOfRecipes: recipe.length,

      recipe,
    },
  });
};

export const addUserToRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe === null) throw Error("Recipe Not Found");
    if (recipe && containsUser(recipe.users, res.locals.user._id)) {
      throw Error("User Already Exists");
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
      }
    );
    res
      .status(200)
      .send({ success: true, message: "Recipe Added Successfully" });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, error: error.message || "User Already Exists" });
  }
};

export const getUrlData = async (req, res) => {
  try {
    const isRecipeAvailable = await Recipe.findOne({
      recipeUrl: req.query.url,
    });
    if (isRecipeAvailable?.status === "SUCCESS") {
      res.send({
        success: true,
        recipe: { id: isRecipeAvailable._id, ...isRecipeAvailable.recipe },
      });
    } else {
      const recipe = await extractRecipes(req.query.url);
      if (recipe.error) throw Error(recipe.error);
      if (isRecipeAvailable) {
        await Recipe.findOneAndUpdate(
          {
            _id: isRecipeAvailable._id,
          },
          {
            recipeUrl: req.query.url,
            status: "SUCCESS",
            recipe: recipe.recipe,
          },
          { new: true }
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
          status: "SUCCESS",
          recipe: recipe.recipe,
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
  } catch (error) {
    const isAlreadyFailedRecipe = await Recipe.findOne({
      recipeUrl: req.query.url,
    });
    if (!isAlreadyFailedRecipe) {
      await Recipe.create({
        recipeUrl: req.query.url,
        status: "FAILED",
        recipe: {},
      });
    }
    res.send({
      success: false,
      error: error.message || "Error Extracting the recipes",
    });
  }
};
