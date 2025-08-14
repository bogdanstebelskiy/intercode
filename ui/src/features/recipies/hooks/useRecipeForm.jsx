import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Unit } from "../constants/index.js";

export function useRecipeForm({ recipe }) {
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);

  useEffect(() => {
    form.setValues(initialValues);
    setIngredients(recipe?.ingredients || []);
  }, [recipe]);

  const initialValues = {
    name: recipe?.name || "",
    timeInMinutes: recipe?.timeInMinutes || 0,
    difficulty: recipe?.difficulty || "easy",
    description: recipe?.description || "",
    photo: recipe?.photo || null,
  };

  const form = useForm({
    initialValues,
    validate: {
      name: (val) => {
        if (!val || val.trim().length === 0) {
          return "Name is required";
        }
        if (val.trim().length < 3) {
          return "Name must be at least 3 characters";
        }
        if (val.trim().length > 100) {
          return "Name must be less than 100 characters";
        }
        return null;
      },

      timeInMinutes: (val) => {
        if (!val && val !== 0) {
          return "Cooking time is required";
        }
        if (typeof val !== "number" || isNaN(val)) {
          return "Cooking time must be a valid number";
        }
        if (val <= 0) {
          return "Cooking time must be greater than 0";
        }
        if (val > 1440) {
          // 24 hours in minutes
          return "Cooking time cannot exceed 24 hours";
        }
        return null;
      },

      difficulty: (val) => {
        const validDifficulties = ["easy", "medium", "hard"];
        if (!val) {
          return "Difficulty level is required";
        }
        if (!validDifficulties.includes(val.toLowerCase())) {
          return "Please select a valid difficulty level";
        }
        return null;
      },

      description: (val) => {
        if (!val || val.trim().length === 0) {
          return "Description is required";
        }
        if (val.trim().length < 10) {
          return "Description must be at least 10 characters";
        }
        if (val.trim().length > 5000) {
          return "Description must be less than 5000 characters";
        }
        return null;
      },

      photo: (val) => {
        if (!val) {
          return "Recipe photo is required";
        }

        if (val instanceof File) {
          const maxSize = 5 * 1024 * 1024;
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];

          if (!allowedTypes.includes(val.type)) {
            return "Photo must be a JPEG, PNG, or WebP image";
          }

          if (val.size > maxSize) {
            return "Photo size must be less than 5MB";
          }
        }

        if (typeof val === "string" && val.trim().length === 0) {
          return "Recipe photo is required";
        }

        return null;
      },
    },
  });

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

  return {
    form,
    ingredients,
    setIngredients,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
  };
}
