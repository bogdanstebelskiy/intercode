import { useForm } from "@mantine/form";
import { Textarea, Button, Text, Stack, Box } from "@mantine/core";
import { useAddComment } from "../hooks/useAddComment.js";

export default function AddComment({ recipeId, onAdded }) {
  const { addComment, loading, error } = useAddComment(recipeId);

  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) =>
        value.trim().length === 0 ? "Comment cannot be empty" : null,
    },
  });

  const handleSubmit = async (values) => {
    const result = await addComment(values.content);

    if (result && onAdded) {
      onAdded(result);
      form.reset();
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: "100%" }}>
      <Stack spacing="sm" style={{ width: "100%" }}>
        <Textarea
          placeholder="Write your comment..."
          label="Comment"
          {...form.getInputProps("content")}
          autosize
          size="md"
          minRows={3}
          maxRows={6}
          style={{ width: "100%" }}
          error={form.errors.content}
        />

        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}

        <Box
          style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            style={{ maxWidth: "100%" }}
          >
            {loading ? "Adding..." : "Add Comment"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
