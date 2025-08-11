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
import { useEffect, useRef } from "react";

export default function RecipeModal({ opened, onClose, recipe = null }) {
  const { user } = useAuth();
  const isEdit = !!recipe;
  const submissionRef = useRef(false);

  const {
    form,
    file,
    setFile,
    fileError,
    description,
    setDescription,
    descriptionError,
    ingredients,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    isSubmitting,
    handleSubmit,
  } = useRecipeForm({ recipe, isEdit, opened, onClose, user });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Update Recipe" : "Add Recipe"}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Name" {...form.getInputProps("name")} required />
          <MDEditor
            autoFocus={true}
            value={description}
            autoFocusEnd={true}
            visibleDragbar={false}
            onChange={setDescription}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
          {descriptionError && (
            <Text c="red" size="sm" mt={5}>
              {descriptionError}
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
            file={file}
            setFile={setFile}
          />
          {fileError && (
            <Text c="red" size="sm" mt={5}>
              {fileError}
            </Text>
          )}

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
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
