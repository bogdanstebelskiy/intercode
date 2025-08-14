import {
  Title,
  Text,
  Stack,
  Loader,
  Flex,
  Skeleton,
  Card,
  Center,
  UnstyledButton,
  Avatar,
} from "@mantine/core";
import { useFetchUserRecipes } from "../../recipies/hooks/useFetchUserRecipes.jsx";
import DetailRecipeCard from "../../recipies/components/DetailRecipeCard.jsx";
import { useNavigate, useParams } from "react-router";
import { useFetchUser } from "../hooks/useFetchUser.js";

function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const { recipes, setRecipes, loading, error } = useFetchUserRecipes(userId);
  const { user, loading: userLoading, error: userError } = useFetchUser(userId);

  const handleRecipeUpdate = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe,
      ),
    );
  };

  const handleRecipeDelete = (deletedRecipeId) => {
    setRecipes((prev) =>
      prev.filter((recipe) => recipe.id !== deletedRecipeId),
    );
    navigate(`/profile/${userId}`);
  };

  return (
    <Stack spacing="md" mt="xl" px="sm">
      {userError ? (
        <Center mt="xl">
          <Card withBorder shadow="sm" p="md" style={{ maxWidth: 400 }}>
            <Text align="center" c="red" weight={700} size="lg">
              User doesn't exist
            </Text>
          </Card>
        </Center>
      ) : userLoading ? (
        <>
          <Flex justify="center" align="center" direction="column">
            <Skeleton height={24} mt={6} width="20%" radius="xl" />
            <Skeleton height={20} mt={6} width="10%" radius="xl" />
          </Flex>
        </>
      ) : (
        <>
          <Flex justify="center" align="center" gap="md">
            <UnstyledButton
              onClick={() => navigate(`/profile/${user.userId}`)}
              style={{ borderRadius: "50%" }}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name || "User avatar"}
                radius="xl"
                size={64}
              />
            </UnstyledButton>
            <Title order={2}>{user?.userName}</Title>
          </Flex>

          {error && (
            <Text align="center" mt="xl" c="red">
              Error: {error}
            </Text>
          )}

          {!loading && recipes.length === 0 && !error && (
            <Text>No recipes yet.</Text>
          )}

          <Flex
            justify="center"
            align="center"
            direction="column"
            gap="md"
            mt="xl"
          >
            {loading ? (
              <Loader />
            ) : (
              recipes.map((recipe) => (
                <DetailRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRecipeUpdate={handleRecipeUpdate}
                  onRecipeDelete={handleRecipeDelete}
                />
              ))
            )}
          </Flex>
        </>
      )}
    </Stack>
  );
}

export default UserProfilePage;
