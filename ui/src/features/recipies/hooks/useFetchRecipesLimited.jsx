import { useEffect, useState, useRef, useCallback } from "react";
import { isEqual } from "lodash";
import RecipeService from "../services/recipes.service.js";

const TAKE = 3;

export default function useFetchRecipesLimited(filters) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
      setLoading(true);
      setLoadingMore(false);
    }

    prevFiltersRef.current = filters;
  }, [filters, isFilterChanged]);

  useEffect(() => {
    if (!hasMore) return;

    const isInitialLoad = skip === 0;

    // Set appropriate loading state
    if (isInitialLoad) {
      setLoading(true);
      setLoadingMore(false);
    } else {
      setLoading(false);
      setLoadingMore(true);
    }

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
        setLoadingMore(false);
      });
  }, [filters, skip, hasMore]);

  const observer = useRef(null);

  const lastPostElementRef = useCallback(
    (node) => {
      // Don't attach observer if we're loading more or initial loading
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            !loading &&
            !loadingMore
          ) {
            setSkip((prevSkip) => prevSkip + TAKE);
          }
        },
        {
          threshold: 1,
        },
      );

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore],
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    recipes,
    setRecipes,
    loading, // true only for initial load or filter changes
    loadingMore, // true only when fetching additional pages
    error,
    hasMore,
    lastPostElementRef,
  };
}
