import RecipeCard from "./RecipeCard.jsx";
import { Alert, Flex, Loader } from "@mantine/core";
import useFetchRecipesLimited from "../hooks/useFetchRecipesLimited.jsx";
import { IconInfoCircle } from "@tabler/icons-react";

export default function RecipeList({ filters }) {
  let { recipes, loading, error, hasMore, lastPostElementRef } =
    useFetchRecipesLimited(filters);

  return (
    <>
      {error ? (
        <Alert
          variant="light"
          color="red"
          title="Error"
          icon={<IconInfoCircle />}
          w="280"
        >
          {error.message || error.toString()}
        </Alert>
      ) : loading ? (
        <Loader color="blue" />
      ) : (
        <Flex justify="center" direction="column" w="80%" gap="md">
          {recipes.map((recipe, idx) => {
            if (recipes.length === idx + 1) {
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  ref={lastPostElementRef}
                />
              );
            } else {
              return <RecipeCard key={recipe.id} recipe={recipe} />;
            }
          })}
          {loading && <div>Loading more...</div>}
          {!hasMore && <div>No more recipes</div>}
        </Flex>
      )}
    </>
  );
}
