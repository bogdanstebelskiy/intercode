import React from "react";
import {
  Select,
  NumberInput,
  TextInput,
  Group,
  Button,
  Stack,
} from "@mantine/core";
import { difficulties, sortFields, sortOrders } from "../constants/index.js";

export default function RecipeFilterSort({ filters, setFilters, onReset }) {
  return (
    <Stack spacing="sm" mb="md" mw={600} mx="auto">
      <Select
        label="Difficulty"
        placeholder="Select difficulty"
        data={difficulties}
        value={filters.difficulty || ""}
        onChange={(value) =>
          setFilters({ ...filters, difficulty: value || undefined })
        }
        clearable
      />

      <NumberInput
        label="Max Time (minutes)"
        placeholder="e.g. 30"
        value={filters.maxTimeInMinutes || ""}
        onChange={(value) =>
          setFilters({ ...filters, maxTimeInMinutes: value || undefined })
        }
        min={0}
      />

      <TextInput
        label="Ingredient Name"
        placeholder="Filter by ingredient"
        value={filters.ingredientName || ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            ingredientName: e.target.value || undefined,
          })
        }
      />

      <Group grow>
        <Select
          label="Sort By"
          data={sortFields}
          value={filters.sortBy || ""}
          onChange={(value) =>
            setFilters({ ...filters, sortBy: value || undefined })
          }
          placeholder="Sort by"
          clearable
        />

        <Select
          label="Sort Order"
          data={sortOrders}
          value={filters.sortOrder || ""}
          onChange={(value) =>
            setFilters({ ...filters, sortOrder: value || undefined })
          }
          placeholder="Sort order"
          clearable
        />
      </Group>
      <Group mt="md">
        <Button flex="1" variant="outline" onClick={onReset}>
          Reset
        </Button>
      </Group>
    </Stack>
  );
}
