import { Alert, Flex, Loader } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import DetailRecipeCard from "../components/DetailRecipeCard.jsx";
import { useNavigate, useParams } from "react-router";
import { useFetchRecipe } from "../hooks/useFetchRecipe.jsx";

export default function DetailRecipePage() {
  let params = useParams();
  const navigate = useNavigate();

  const {
    recipe,
    setRecipe,
    loading,
    error: fetchError,
  } = useFetchRecipe(params.recipeId);

  const handleRecipeUpdate = (updatedRecipe) => {
    setRecipe(updatedRecipe);
  };

  const handleRecipeDelete = () => {
    navigate("/");
  };

  return (
    <Flex justify="center" align="center" mt="xl">
      {fetchError ? (
        <Alert
          variant="light"
          color="red"
          title="Error"
          icon={<IconInfoCircle />}
          w="280"
        >
          {fetchError.message || fetchError.toString()}
        </Alert>
      ) : loading ? (
        <Loader color="blue" />
      ) : (
        <DetailRecipeCard
          recipe={recipe}
          onRecipeUpdate={handleRecipeUpdate}
          onRecipeDelete={handleRecipeDelete}
        />
      )}
    </Flex>
  );
}
