import { useState, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import RecipeService from "../services/recipes.service.js";

export function useDeleteRecipe() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRecipe = useCallback(
    async (recipeId) => {
      if (isDeleting) return;

      setIsDeleting(true);
      const controller = new AbortController();

      try {
        await RecipeService.deleteRecipe(recipeId, {
          signal: controller.signal,
        });

        notifications.show({
          title: "Recipe deleted",
          message: "Your recipe was removed successfully.",
          color: "green",
          position: "bottom-center",
        });

        return true;
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Delete request aborted");
        } else {
          notifications.show({
            title: "Delete failed",
            message: "Something went wrong while deleting.",
            color: "red",
            position: "bottom-center",
          });
        }
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [isDeleting],
  );

  return { isDeleting, deleteRecipe };
}
