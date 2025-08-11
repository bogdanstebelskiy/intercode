import api from "../../auth/services/api.js";

const getRecipes = async (filters, options = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });

  try {
    const response = await api.get(
      `/recipes?${queryParams.toString()}`,
      options,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching recipes:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const getRecipeById = async (id, options = {}) => {
  try {
    const response = await api.get(`/recipes/${id}`, options);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching recipe with id ${id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

const getUserRecipes = async (id, options) => {
  try {
    const response = await api.get(`/users/${id}/recipes`, options);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching recipes of user with id ${id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

const createRecipe = async (recipe) => {
  try {
    const response = await api.post(`/recipes`, recipe);
    return response.data;
  } catch (error) {
    console.error(`Error adding recipe`, error.response?.data || error.message);
    throw error;
  }
};

const updateRecipe = async (recipeId, recipeData) => {
  try {
    const response = await api.patch(`/recipes/${recipeId}`, recipeData);
    return response.data;
  } catch (error) {
    console.error(`Error adding recipe`, error.response?.data || error.message);
    throw error;
  }
};

const deleteRecipe = async (recipeId, options = {}) => {
  try {
    const response = await api.delete(`/recipes/${recipeId}`, options);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting recipe`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

const rateRecipe = async (id, val) => {
  try {
    const response = await api.post(`/recipes/${id}/rating`, { value: val });
    return response.data;
  } catch (error) {
    console.error(
      `Error rating recipe with id ${id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

const toggleRecipeLike = async (id, liked) => {
  try {
    if (liked) {
      await api.delete(`/recipes/${id}/like`);
    } else {
      await api.post(`/recipes/${id}/like`);
    }

    return true;
  } catch (error) {
    console.error(
      `Error toggling like for recipe with id ${id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

const RecipeService = {
  getRecipes,
  getRecipeById,
  getUserRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  toggleRecipeLike,
};

export default RecipeService;
