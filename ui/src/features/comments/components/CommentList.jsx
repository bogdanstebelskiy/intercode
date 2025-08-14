import CommentCard from "./CommentCard.jsx";

import { Loader, Text, Stack, Flex } from "@mantine/core";
import { useFetchRecipeComments } from "../hooks/useFetchRecipeComments";
import AddComment from "./AddComment.jsx";
import { useAuth } from "../../auth/providers/AuthProvider.jsx";

export default function CommentList({ recipeId }) {
  const { comments, setComments, loading, error } =
    useFetchRecipeComments(recipeId);

  const { user } = useAuth();

  const handleDeleted = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <Flex direction="column" mb="md">
      {user && <AddComment recipeId={recipeId} onAdded={handleAdded} />}
      {!recipeId ? (
        <Text c="dimmed">No recipe selected.</Text>
      ) : loading ? (
        <Stack align="center" m="md">
          <Loader size="sm" />
          <Text>Loading comments...</Text>
        </Stack>
      ) : error ? (
        <Text c="red" m="md">
          {error}
        </Text>
      ) : comments.length === 0 ? (
        <Text c="dimmed" m="md" align="center">
          No comments yet.
        </Text>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDeleted={handleDeleted}
          />
        ))
      )}
    </Flex>
  );
}
