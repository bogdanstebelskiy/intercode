import { useState, useEffect } from "react";
import RecipeService from "../services/recipes.service.js";

export function useFetchUserRecipes(userId) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    RecipeService.getUserRecipes(userId, { signal: controller.signal })
      .then((recipes) => {
        setRecipes(recipes);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [userId]);

  return { recipes, loading, error };
}
