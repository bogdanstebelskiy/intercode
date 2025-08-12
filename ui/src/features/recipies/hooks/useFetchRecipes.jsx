import { useEffect, useState } from "react";
import RecipeService from "../services/recipes.service.js";

export function useFetchRecipes(filters) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [skip, setSkip] = useState(0);
  //const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let canceled = false;
    setLoading(true);

    RecipeService.getRecipes(filters)
      .then((recipes) => {
        if (!canceled) {
          setRecipes([...recipes]);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!canceled) setError(err.message);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [filters]);
  /*const observer = useRef(null);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setSkip((prevSkip) => prevSkip + filters.take);
          }
        },
        { threshold: 1.0 },
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );*/

  /*useEffect(() => {
    let canceled = false;
    setLoading(true);

    getRecipes(filters)
      .then((recipes) => {
        if (!canceled) {
          setRecipes((prev) => [...prev, ...recipes]);
          setLoading(false);
          if (recipes.length < filters.take) {
            setHasMore(false);
          }
        }
      })
      .catch((err) => {
        if (!canceled) setError(err.message);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [skip]);
   */

  return { recipes, loading, error }; //hasMore , lastPostElementRef };
}
