import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  List,
  Spoiler,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { formatTime } from "../utils/formatters.js";
import MDEditor from "@uiw/react-md-editor";
import { IconCircleCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import { useAuth } from "../../auth/providers/AuthProvider.jsx";
import RecipeRating from "./RecipeRating.jsx";
import LikeButton from "./LikeButton.jsx";
import RecipeModal from "./RecipeModal.jsx";
import { useDisclosure } from "@mantine/hooks";
import { getBadgeColor } from "../utils/helpers.js";
import { useDeleteRecipe } from "../hooks/useDeleteRecipe.jsx";
import { useNavigate } from "react-router";

const DetailRecipeCard = ({ recipe }) => {
  const { user } = useAuth();

  const [opened, { open, close }] = useDisclosure(false);

  const badgeColor = getBadgeColor(recipe.difficulty);

  const navigate = useNavigate();

  const { isDeleting, deleteRecipe } = useDeleteRecipe(recipe.id);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w="80%">
      <Card.Section>
        <Image src={recipe.photo} height={160} alt={recipe.name} />
      </Card.Section>

      <Group justify="space-between" align="center" mt="md">
        <Group gap="xs">
          <Text fw={700} size="xl">
            {recipe.name}
          </Text>
          {user?.userId === recipe.authorId && (
            <RecipeModal
              opened={opened}
              onClose={close}
              recipe={recipe}
              title={"Edit recipe"}
              onSubmit={() => {}}
            />
          )}
          {user?.userId === recipe.authorId && (
            <Button variant="outline" onClick={open}>
              <IconEdit size={16} />
            </Button>
          )}
        </Group>

        <Group>
          <Badge color={badgeColor}>{recipe.difficulty}</Badge>
          {user?.userId && (
            <LikeButton recipeId={recipe.id} initialValue={recipe.userLiked} />
          )}
        </Group>
      </Group>

      <Group gap={4} mt="xs">
        <Text>Cooking time:</Text>
        <Text fw={700}>{formatTime(recipe.timeInMinutes)}</Text>
      </Group>

      <Spoiler
        maxHeight={0}
        showLabel="Show description"
        hideLabel="Hide"
        mt="md"
      >
        <Card.Section mt="lg">
          <MDEditor.Markdown
            source={recipe.description}
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "white",
              color: "black",
              borderTop: "1px solid black",
              padding: "2rem",
            }}
          />
        </Card.Section>

        <Card.Section px="2rem" pb="2rem" mb="sm">
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size={16} />
              </ThemeIcon>
            }
          >
            {recipe.ingredients.map((ingredient, index) => (
              <List.Item key={`${ingredient.name}-${index}`}>
                <Text size="lg">
                  {ingredient.name}: {ingredient.amount} {ingredient.unit}
                </Text>
              </List.Item>
            ))}
          </List>
        </Card.Section>
      </Spoiler>

      {user?.userId && (
        <Card.Section>
          <Group justify="flex-end" mr="md" mt="md">
            <RecipeRating
              recipeId={recipe.id}
              initialValue={recipe.userRating}
            />
          </Group>
          <Group justify="flex-end" m="md">
            {user?.userId && user?.userId === recipe.authorId && (
              <Button
                onClick={async () => {
                  await deleteRecipe(recipe.id);
                  navigate("/");
                }}
                disabled={isDeleting}
                color="red"
                leftSection={<IconTrash size={16} />}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </Group>
        </Card.Section>
      )}
    </Card>
  );
};

export default DetailRecipeCard;
