import RecipeCard from "./RecipeCard.jsx";
import { Alert, Flex, Loader } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function RecipeList({
  recipes,
  loading,
  loadingMore,
  error,
  hasMore,
  lastPostElementRef,
}) {
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
          {loadingMore && (
            <Flex align="center" justify="center">
              Loading more...
            </Flex>
          )}
          {!hasMore && (
            <Flex align="center" justify="center">
              No more recipes
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
}
