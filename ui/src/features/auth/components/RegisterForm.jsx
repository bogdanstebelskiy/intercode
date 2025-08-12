import {
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import AuthService from "../services/auth.service.js";

export default function RegisterForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      userName: "",
      password: "",
      confirmPassword: "",
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
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSingup = async (values) => {
    const success = await AuthService.signup(values.userName, values.password);

    if (!success) {
      notifications.show({
        title: "Couldn't register",
        message: "Something went wrong",
        color: "red",
        position: "bottom-center",
      });

      return;
    }

    form.reset();

    notifications.show({
      title: "Registration successful",
      message: "You can now log in with your credentials.",
      color: "green",
      position: "bottom-center",
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder miw="280" w="380">
      <Title order={2} align="center" mb="lg">
        Registration
      </Title>
      <form onSubmit={form.onSubmit((values) => handleSingup(values))}>
        <Stack gap="lg">
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

          <PasswordInput
            withAsterisk
            label="Confirm password"
            placeholder="Here goes your password confirmation"
            key={form.key("confirmPassword")}
            {...form.getInputProps("confirmPassword")}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Signup</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
