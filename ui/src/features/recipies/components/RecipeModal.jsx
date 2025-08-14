import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  ActionIcon,
  Stack,
  Divider,
  Text,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import Dropzone from "../../../components/Dropzone.jsx";
import { useAuth } from "../../auth/providers/AuthProvider.jsx";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { difficulties, Unit } from "../constants/index.js";
import { useRecipeForm } from "../hooks/useRecipeForm.jsx";
import RecipeService from "../services/recipes.service.js";
import { notifications } from "@mantine/notifications";
import { getPhotoUrl } from "../../upload/utils/helpers.js";

export default function RecipeModal({
  opened,
  onClose,
  recipe = null,
  onRecipeUpdate,
  onRecipeCreate,
}) {
  const { user } = useAuth();
  const isEdit = !!recipe;

  const {
    form,
    ingredients,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
  } = useRecipeForm({ recipe, isEdit, opened, onClose, user });

  const handleSubmit = async (values) => {
    const uploadedPhotoUrl = await getPhotoUrl(values.photo);

    try {
      const recipeData = {
        ...values,
        ingredients,
        photo: uploadedPhotoUrl,
        authorId: user?.userId ?? recipe?.authorId ?? undefined,
      };

      if (isEdit) {
        const updatedRecipe = await RecipeService.updateRecipe(
          recipe.id,
          recipeData,
        );
        console.log(updatedRecipe);
        onRecipeUpdate(updatedRecipe);
        notifications.show({
          title: "Recipe updated",
          message: "Your recipe was updated successfully.",
          color: "green",
        });
      } else {
        const newRecipe = await RecipeService.createRecipe(recipeData);
        onRecipeCreate(newRecipe);
        notifications.show({
          title: "Recipe created",
          message: "Your recipe was created successfully.",
          color: "green",
        });
      }
    } catch {
      notifications.show({
        title: "Couldn't save recipe",
        message: "Something went wrong",
        color: "red",
      });
    } finally {
      form.reset();
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={isEdit ? "Update Recipe" : "Add Recipe"}
      size="xl"
      lockScroll={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Name" {...form.getInputProps("name")} required />
          <MDEditor
            data-color-mode="light"
            autoFocus={true}
            autoFocusEnd={true}
            {...form.getInputProps("description")}
            visibleDragbar={false}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
          {form.errors.description && (
            <Text size="sm" c="red">
              {form.errors.description}
            </Text>
          )}
          <NumberInput
            label="Time (minutes)"
            {...form.getInputProps("timeInMinutes")}
            min={1}
            required
          />
          <Select
            label="Difficulty"
            data={difficulties}
            {...form.getInputProps("difficulty")}
          />
          <Dropzone
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
              marginTop: "10px",
            }}
            {...form.getInputProps("photo")}
          />

          <Divider label="Ingredients" />

          {ingredients.map((ingredient, index) => (
            <Group key={index} grow>
              <TextInput
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                required
              />
              <NumberInput
                placeholder="Amount"
                value={ingredient.amount}
                min={0}
                onChange={(val) => handleIngredientChange(index, "amount", val)}
                required
              />
              <Select
                placeholder="Unit"
                data={Object.entries(Unit).map(([key, val]) => ({
                  value: val,
                  label: `${key.charAt(0) + key.slice(1).toLowerCase()} (${val})`,
                }))}
                value={ingredient.unit}
                onChange={(val) => handleIngredientChange(index, "unit", val)}
                required
              />
              <ActionIcon color="red" onClick={() => removeIngredient(index)}>
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
          ))}

          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={addIngredient}
            type="button"
          >
            Add Ingredient
          </Button>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.submitting}
              loading={form.submitting}
              onClick={() => console.log(form.validate())}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
