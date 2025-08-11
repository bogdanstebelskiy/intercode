import { useState } from "react";
import RecipeService from "../services/recipes.service.js";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

export default function LikeButton({ recipeId, initialValue }) {
  const [liked, setLiked] = useState(initialValue);

  const toggleLike = async () => {
    const result = await RecipeService.toggleRecipeLike(recipeId, liked);

    if (result) {
      setLiked(!liked);
    }
  };

  return (
    <Tooltip label={liked ? "Unlike" : "Like"} position="top">
      <ActionIcon
        onClick={toggleLike}
        color={liked ? "red" : "gray"}
        variant="subtle"
        radius="xl"
        size="lg"
      >
        {liked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
