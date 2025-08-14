import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Image,
  List,
  Menu,
  Skeleton,
  Spoiler,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { formatTime } from "../utils/formatters.js";
import MDEditor from "@uiw/react-md-editor";
import {
  IconCircleCheck,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useAuth } from "../../auth/providers/AuthProvider.jsx";
import RecipeRating from "./RecipeRating.jsx";
import LikeButton from "./LikeButton.jsx";
import RecipeModal from "./RecipeModal.jsx";
import { useDisclosure } from "@mantine/hooks";
import { getBadgeColor } from "../utils/helpers.js";
import { useDeleteRecipe } from "../hooks/useDeleteRecipe.jsx";
import { Link } from "react-router";
import CommentList from "../../comments/components/CommentList.jsx";
import { useFetchUser } from "../../user/hooks/useFetchUser.js";
import { IconCircleFilled } from "@tabler/icons-react";

const DetailRecipeCard = ({ recipe, onRecipeUpdate, onRecipeDelete }) => {
  const { user } = useAuth();

  const { user: author, loading: authorLoading } = useFetchUser(
    recipe.authorId,
  );

  const [opened, { open, close }] = useDisclosure(false);

  const badgeColor = getBadgeColor(recipe.difficulty);

  const { isDeleting, deleteRecipe } = useDeleteRecipe(recipe.id);

  const handleDelete = async () => {
    try {
      await deleteRecipe(recipe.id);
      onRecipeDelete(recipe.id);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w="80%">
      <Card.Section>
        <Image src={recipe.photo} height={160} alt={recipe.name} />
      </Card.Section>

      <Group justify="space-between" align="center" mt="md">
        <Group gap="xs">
          <Text fw={700} size="xl">
            <Link
              to={`/recipe/${recipe.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {recipe.name}
            </Link>
          </Text>
          {user?.userId && user?.userId === recipe.authorId && (
            <Menu position="bottom" shadow="md" withinPortal>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={open} rightSection={<IconEdit size={14} />}>
                  Update
                </Menu.Item>
                <Menu.Item
                  onClick={handleDelete}
                  disabled={isDeleting}
                  loading={isDeleting}
                  color="red"
                  rightSection={<IconTrash size={14} />}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {user?.userId === recipe.authorId && (
            <RecipeModal
              opened={opened}
              onClose={close}
              recipe={recipe}
              onRecipeUpdate={onRecipeUpdate}
              title={"Edit recipe"}
              onSubmit={() => {}}
            />
          )}
        </Group>

        <Group>
          <Badge color={badgeColor}>{recipe.difficulty}</Badge>
          {user?.userId && (
            <LikeButton recipeId={recipe.id} initialValue={recipe.userLiked} />
          )}
        </Group>
      </Group>

      <Group gap={4} mt="xs" align="center">
        <Text size="sm" c="dimmed">
          by:
        </Text>

        {authorLoading ? (
          <Skeleton height={16} width={80} radius="sm" />
        ) : author ? (
          <Link
            to={`/profile/${author.userId}`}
            style={{ textDecoration: "none" }}
          >
            <Text size="sm" fw={500} c="blue">
              {author.userName}
            </Text>
          </Link>
        ) : (
          <Text size="sm" c="dimmed">
            Unknown
          </Text>
        )}
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
        <Card.Section m="md" mt="sm">
          <Title order={2} align="center" mb="md">
            Description:
          </Title>
          <MDEditor.Markdown
            data-color-mode="light"
            source={recipe.description}
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "white",
              color: "black",
            }}
          />
        </Card.Section>

        <Card.Section px="2rem" pb="2rem" mb="sm">
          <Title order={2} align="center" mb="md">
            Ingredients:
          </Title>
          <Flex mx="xl">
            <List listStyleType="disc" spacing="xs" size="sm" center>
              {recipe.ingredients.map((ingredient, index) => (
                <List.Item key={`${ingredient.name}-${index}`}>
                  <Text size="lg">
                    {ingredient.name}: {ingredient.amount} {ingredient.unit}
                  </Text>
                </List.Item>
              ))}
            </List>
          </Flex>
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
        </Card.Section>
      )}
      <Card.Section m="md">
        <Spoiler
          maxHeight={0}
          showLabel="Show comments"
          hideLabel="Hide comments"
        >
          <CommentList recipeId={recipe.id} />
        </Spoiler>
      </Card.Section>
    </Card>
  );
};

export default DetailRecipeCard;
