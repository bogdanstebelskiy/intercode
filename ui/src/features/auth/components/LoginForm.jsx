import {
  Box,
  Button,
  Card,
  Flex,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import AuthService from "../services/auth.service.js";

export default function LoginForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      userName: "",
      password: "",
    },

    validate: {
      userName: (value) => {
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 20) return "Username must be at most 20 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Invalid username";
        return null;
      },
      password: (value) => {
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length > 64) return "Password must be at most 64 characters";
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/.test(value))
          return "Password must include lowercase, uppercase, number and special character";
        return null;
      },
    },
  });

  const { isAuth, setIsAuth, setUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    const userId = await AuthService.login(values.userName, values.password);

    if (!userId) {
      notifications.show({
        title: "Unauthorized",
        message: "Invalid credentials",
        color: "red",
        position: "bottom-center",
      });
      return;
    }

    notifications.show({
      title: "Login successful",
      message: "Redirection to home page",
      color: "green",
      position: "bottom-center",
    });

    setIsAuth(true);
    console.log("USERIDDDDD: " + JSON.stringify(userId));

    setUser({ userId });

    navigate("/", { replace: true });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder miw="280" w="380">
      <Title order={2} align="center" mb="lg">
        Login
      </Title>

      <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
        <Stack spacing="lg">
          <TextInput
            withAsterisk
            label="Username"
            placeholder="Here goes your username"
            key={form.key("userName")}
            {...form.getInputProps("userName")}
          />

          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Here goes your password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Login</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
