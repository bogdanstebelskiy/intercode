import { useEffect, useState } from "react";
import api from "../../auth/services/api.js";

export function useFetchRecipeComments(recipeId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recipeId) return;

    const controller = new AbortController();

    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/comments/recipe/${recipeId}`, {
          signal: controller.signal,
        });

        setComments(response.data);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load comments",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    return () => {
      controller.abort();
    };
  }, [recipeId]);

  return { comments, setComments, loading, error };
}
