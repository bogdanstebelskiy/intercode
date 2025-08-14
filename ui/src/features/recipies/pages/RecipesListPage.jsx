import { Autocomplete, Box, Button, Flex, Popover, Stack } from "@mantine/core";
import RecipeList from "../components/RecipeList.jsx";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../../auth/providers/AuthProvider.jsx";
import { useState } from "react";
import useDebounce from "../../../hooks/useDebounce.js";
import RecipeModal from "../components/RecipeModal.jsx";
import RecipeFilterSort from "../components/RecipeFilterSort.jsx";
import useFetchRecipesLimited from "../hooks/useFetchRecipesLimited.jsx";
import { IconFilter } from "@tabler/icons-react";

export default function RecipesListPage() {
  const { isAuth } = useAuth();

  const [filters, setFilters] = useState({
    name: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const debouncedFilters = useDebounce(filters, 500);

  /* let { recipes, loading, loadingMore, error, hasMore, lastPostElementRef } =
    useFetchRecipesLimited(filters);*/
  const recipeData = useFetchRecipesLimited(debouncedFilters);

  const [opened, { open, close }] = useDisclosure(false);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const handleReset = () => {
    setFilters({
      name: "",
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
  };

  const updateFilter = (key, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleRecipeCreate = (newRecipe) => {
    recipeData.setRecipes((prev) => [newRecipe, ...prev]);
  };

  return (
    <>
      <Stack>
        <Flex justify="center" align="center" mt="md" gap="xs">
          <RecipeModal
            opened={opened}
            onClose={close}
            recipe={null}
            onRecipeCreate={handleRecipeCreate}
          />
          {isAuth && (
            <Button variant="outline" onClick={open}>
              <IconPlus size={20} />
            </Button>
          )}
          <Autocomplete
            clearable
            value={filters.name}
            onChange={(value) => updateFilter("name", value)}
            placeholder="Find me..."
            w={{ base: "70%" }}
          />
          <Popover
            opened={popoverOpened}
            onClose={() => setPopoverOpened(false)}
            width={320}
            position="bottom"
            withArrow
            shadow="md"
            trapFocus
            closeOnEscape
          >
            <Popover.Target>
              <Button
                variant="outline"
                onClick={() => setPopoverOpened((o) => !o)}
              >
                <IconFilter size={16} />
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Box p="sm">
                <RecipeFilterSort
                  filters={filters}
                  setFilters={setFilters}
                  onReset={handleReset}
                />
              </Box>
            </Popover.Dropdown>
          </Popover>
        </Flex>
        <Flex justify="center" align="center" mt="md">
          <RecipeList {...recipeData} />
        </Flex>
      </Stack>
    </>
  );
}
