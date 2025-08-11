import RecipeService from "../services/recipes.service.js";
import { useState } from "react";
import { Flex, Rating, Text } from "@mantine/core";

export default function RecipeRating({ recipeId, initialValue }) {
  const [value, setValue] = useState(initialValue);

  const handleRate = async (val) => {
    const result = await RecipeService.rateRecipe(recipeId, val);
    if (result) {
      setValue(val);
    }
  };

  return (
    <Flex align="center" gap="sm">
      <Rating value={value} onChange={handleRate} size="lg" />
      <Text size="sm" c="dimmed">
        {value ? value.toFixed(1) : 0} / 5
      </Text>
    </Flex>
  );
}
