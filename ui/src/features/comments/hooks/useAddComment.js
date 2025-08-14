import { useState } from "react";
import api from "../../auth/services/api.js";

export function useAddComment(recipeId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addComment = async (content) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/comments`, {
        content,
        recipeId,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
}
