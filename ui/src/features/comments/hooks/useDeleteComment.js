import { useState } from "react";
import api from "../../auth/services/api.js";

export function useDeleteComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteComment = async (commentId) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/comments/${commentId}`);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete comment",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteComment, loading, error };
}
