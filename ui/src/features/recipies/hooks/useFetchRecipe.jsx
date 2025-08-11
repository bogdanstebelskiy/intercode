import { useState, useEffect } from "react";
import RecipeService from "../services/recipes.service.js"; // Assuming you have this function

export function useFetchRecipe(recipeId) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recipeId) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    RecipeService.getRecipeById(recipeId, { signal: controller.signal })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch recipe request aborted");
        } else {
          setError(err.message || "An error occurred");
        }
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [recipeId]);

  return { recipe, loading, error };
}
