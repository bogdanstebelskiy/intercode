import { useEffect, useState } from "react";
import api from "../../auth/services/api.js";

export function useFetchUser(userId) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/users/${userId}`, {
          signal: controller.signal,
        });

        setUser(response.data.user);
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

    fetchUser();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return { user, loading, error };
}
