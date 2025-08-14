import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { formatTime } from "../utils/formatters.js";
import { forwardRef } from "react";
import { Link } from "react-router";
import { getBadgeColor } from "../utils/helpers.js";
import { useFetchUser } from "../../user/hooks/useFetchUser.js";

const RecipeCard = forwardRef(function RecipeCard({ recipe }, ref) {
  const badgeColor = getBadgeColor(recipe.difficulty);

  const { user: author } = useFetchUser(recipe.authorId);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder ref={ref}>
      <Card.Section>
        <Image src={recipe.photo} height={160} alt={recipe.name} />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <Text fw={700}>{recipe.name}</Text>
        <Badge color={badgeColor}>{recipe.difficulty}</Badge>
      </Group>

      <Group gap={4} mt="xs">
        <Text size="sm" c="dimmed">
          by:
        </Text>
        {author ? (
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

      <Link
        to={`/recipe/${recipe.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Button color="blue" fullWidth mt="md" radius="md">
          Try it
        </Button>
      </Link>
    </Card>
  );
});

export default RecipeCard;
