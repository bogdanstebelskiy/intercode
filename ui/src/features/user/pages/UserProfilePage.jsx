import { useEffect, useState } from "react";
import {
  Title,
  Text,
  Stack,
  Loader,
  Card,
  Image,
  SimpleGrid,
  Flex,
} from "@mantine/core";
import { useFetchUserRecipes } from "../../recipies/hooks/useFetchUserRecipes.jsx";
import { useAuth } from "../../auth/providers/AuthProvider.jsx";
import DetailRecipeCard from "../../recipies/components/DetailRecipeCard.jsx";
import withAuth from "../../auth/hocs/withAuth.jsx";

function UserProfilePage() {
  const { user } = useAuth();
  console.log("USER PROFILE" + JSON.stringify(user));
  const { recipes, loading, error } = useFetchUserRecipes(user?.userId);

  if (loading) return <Loader size="lg" />;

  if (error)
    return (
      <Text align="center" mt="xl">
        Error: {error}
      </Text>
    );

  return (
    <Stack spacing="md" mt="xl" px="sm">
      <Title order={2}>Hello, {user?.userName}!</Title>
      <Text size="lg" weight={500} mb="md">
        Your Recipes
      </Text>

      {recipes.length === 0 && <Text>You have no recipes yet.</Text>}

      <Flex justify="center" align="center" direction="column" gap="md" mt="xl">
        {recipes.map((recipe) => (
          <DetailRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Flex>
    </Stack>
  );
}

export default withAuth(UserProfilePage);
