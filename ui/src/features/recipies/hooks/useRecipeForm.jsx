import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import UploadService from "../../upload/services/upload.service.js";
import RecipeService from "../services/recipes.service.js";
import { Unit } from "../constants/index.js";

export function useRecipeForm({ recipe, isEdit, opened, onClose, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(recipe?.photo || null);
  const [fileError, setFileError] = useState("");
  const [description, setDescription] = useState(recipe?.description || "");
  const [descriptionError, setDescriptionError] = useState("");
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);

  const form = useForm({
    initialValues: {
      name: recipe?.name || "",
      timeInMinutes: recipe?.timeInMinutes || 0,
      difficulty: recipe?.difficulty || "easy",
    },
    validate: {
      name: (val) =>
        val.length < 3 ? "Name must be at least 3 characters" : null,
      timeInMinutes: (val) => (val <= 0 ? "Time must be greater than 0" : null),
    },
  });

  useEffect(() => {
    if (opened) {
      const initialValues = {
        name: recipe?.name || "",
        timeInMinutes: recipe?.timeInMinutes || 0,
        difficulty: recipe?.difficulty || "easy",
      };

      form.setValues(initialValues);
      form.resetDirty(initialValues); // Reset dirty state too
      setIngredients(recipe?.ingredients || []);
      setFile(recipe?.photo || null);
      setDescription(recipe?.description || "");
      setFileError("");
      setDescriptionError("");
      setIsSubmitting(false);
    }
  }, [opened, recipe]);

  const validateForm = () => {
    let valid = true;

    if (!file) {
      setFileError("Please upload a photo.");
      valid = false;
    } else {
      setFileError("");
    }

    if (!description.trim()) {
      setDescriptionError("Description is required.");
      valid = false;
    } else {
      setDescriptionError("");
    }

    return valid && form.validate().hasErrors === false;
  };

  const notifySuccess = (message) => {
    notifications.show({
      title: message,
      message: `Your recipe was ${message.toLowerCase()} successfully.`,
      color: "green",
      position: "bottom-center",
    });
  };

  const notifyError = () => {
    notifications.show({
      title: "Couldn't save recipe",
      message: "Something went wrong",
      color: "red",
      position: "bottom-center",
    });
  };

  const getPhotoUrl = async (file) => {
    if (file instanceof File) {
      return await UploadService.uploadFile(file);
    }
    return file;
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { name: "", amount: 0, unit: Unit.GRAM },
    ]);
  };

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fileUrl = await getPhotoUrl(file);

      const recipeData = {
        ...form.values,
        ingredients,
        description,
        photo: fileUrl,
        authorId: user?.userId ?? recipe?.authorId ?? undefined,
      };

      if (isEdit) {
        await RecipeService.updateRecipe(recipe.id, recipeData);
        notifySuccess("Recipe updated");
      } else {
        await RecipeService.createRecipe(recipeData);
        notifySuccess("Recipe created");
      }

      onClose();
    } catch {
      notifyError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    file,
    setFile,
    fileError,
    descriptionError,
    setDescriptionError,
    description,
    setDescription,
    ingredients,
    setIngredients,
    isSubmitting,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    handleSubmit,
  };
}
