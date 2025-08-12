import { useCallback, useEffect, useRef, useState } from "react";
import RecipeService from "../services/recipes.service.js";
import { isEqual } from "lodash";

const TAKE = 3;

export default function useFetchRecipes(filters) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const prevFiltersRef = useRef(null);
  const isFilterChanged = !isEqual(prevFiltersRef.current, filters);

  useEffect(() => {
    if (isFilterChanged) {
      setRecipes([]);
      setSkip(0);
      setHasMore(true);
      setError(null);
    }

    prevFiltersRef.current = filters;
  }, [filters, isFilterChanged]);

  useEffect(() => {
    if (!hasMore) return;

    setLoading(true);
    setError(null);

    RecipeService.getRecipes({ ...filters, take: TAKE, skip })
      .then((newRecipes) => {
        if (newRecipes.length < TAKE) {
          setHasMore(false);
        }

        setRecipes((prev) => {
          return skip === 0 ? newRecipes : [...prev, ...newRecipes];
        });
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters, skip, hasMore]);

  const observer = useRef(null);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setSkip((prevSkip) => prevSkip + TAKE);
          }
        },
        { threshold: 1.0 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { recipes, loading, error, hasMore, lastPostElementRef };
}
