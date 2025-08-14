import {
  Avatar,
  Card,
  Group,
  Menu,
  Text,
  ActionIcon,
  Stack,
  Box,
  em,
} from "@mantine/core";
import { IconUser, IconDots, IconTrash } from "@tabler/icons-react";
import { useDeleteComment } from "../hooks/useDeleteComment.js";
import { useAuth } from "../../auth/providers/AuthProvider.jsx";
import { Link } from "react-router";
import { useMediaQuery } from "@mantine/hooks";

export default function CommentCard({ comment, onDeleted }) {
  const { user } = useAuth();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { deleteComment, loading } = useDeleteComment();

  const handleDelete = async () => {
    const success = await deleteComment(comment.id);

    if (success && onDeleted) {
      onDeleted(comment.id);
    }
  };

  return (
    <Card radius="md" p={isMobile ? "xs" : "md"} shadow="none">
      {isMobile ? (
        <Stack spacing="xs" mt="md">
          <Group position="apart" spacing="xs">
            <Group spacing="xs">
              <Link to={`/profile/${comment?.user?.id}`}>
                <Avatar
                  src={comment?.user?.avatar}
                  alt={comment?.user?.userName}
                  radius="xl"
                  size="sm"
                  color="blue"
                >
                  {!comment?.avatar && <IconUser size={16} />}
                </Avatar>
              </Link>
              <div>
                <Link
                  to={`/profile/${comment?.user?.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Text fw={500} size="sm">
                    {comment?.user?.userName}
                  </Text>
                </Link>
                <Text size="xs" c="dimmed">
                  {new Date(comment?.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              </div>
            </Group>

            {comment?.user?.id === user?.userId && (
              <Menu position="bottom" shadow="md" withinPortal>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconTrash size={14} />}
                    color="red"
                    disabled={loading}
                    onClick={handleDelete}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          <Box>
            <Text
              size="md"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                width: "100%",
                lineHeight: 1.4,
              }}
            >
              {comment?.content}
            </Text>
          </Box>
        </Stack>
      ) : (
        <Group align="flex-start" spacing="md">
          <Link to={`/profile/${comment?.user?.id}`}>
            <Avatar
              src={comment?.user?.avatar}
              alt={comment?.user?.userName}
              radius="xl"
              size="md"
              color="blue"
            >
              {!comment?.avatar && <IconUser size={18} />}
            </Avatar>
          </Link>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Group position="apart" spacing={0}>
              <Link
                to={`/profile/${comment?.user?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Text fw={500}>{comment?.user?.userName}</Text>
              </Link>
              <Text size="xs" c="dimmed">
                {new Date(comment?.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
              {comment?.user?.id === user?.userId && (
                <Menu position="bottom" shadow="md" withinPortal>
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <IconDots size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<IconTrash size={14} />}
                      color="red"
                      disabled={loading}
                      onClick={handleDelete}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>

            <Box style={{ width: "100%" }}>
              <Text
                size="md"
                mt={4}
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  width: "100%",
                }}
              >
                {comment?.content}
              </Text>
            </Box>
          </div>
        </Group>
      )}
    </Card>
  );
}
