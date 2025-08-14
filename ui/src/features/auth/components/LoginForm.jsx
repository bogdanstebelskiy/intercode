import {
  Button,
  Card,
  Flex,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import AuthService from "../services/auth.service.js";
import { useRecaptcha } from "../hooks/useRecaptcha.js";
import ReCAPTCHA from "react-google-recaptcha";

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
  const {
    recaptchaValue,
    setRecaptchaValue,
    recaptchaError,
    setRecaptchaError,
    recaptchaRef,
    handleRecaptchaChange,
    handleRecaptchaExpired,
    validateRecaptcha,
  } = useRecaptcha();

  const { isAuth, setIsAuth, setUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setRecaptchaError("");

    if (!validateRecaptcha()) {
      return;
    }

    const user = await AuthService.login(values.userName, values.password);

    if (!user) {
      notifications.show({
        title: "Unauthorized",
        message: "Invalid credentials",
        color: "red",
      });

      setRecaptchaValue(null);
      recaptchaRef.current?.reset();
      return;
    }

    notifications.show({
      title: "Login successful",
      message: "Redirection to home page",
      color: "green",
    });

    form.reset();
    setRecaptchaValue(null);
    recaptchaRef.current?.reset();

    setIsAuth(true);

    setUser(user);

    navigate("/", { replace: true });
  };

  const isFormValid = () => {
    return (
      !form.isDirty() || Object.keys(form.errors).length > 0 || !recaptchaValue
    );
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

          <Flex justify="center" align="center" mt="md">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaExpired}
              onError={() => {
                setRecaptchaValue(null);
                setRecaptchaError(
                  "reCAPTCHA error occurred. Please try again.",
                );
              }}
            />
            {recaptchaError && (
              <Text size="xs" c="red" mt={5}>
                {recaptchaError}
              </Text>
            )}
          </Flex>

          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              disabled={form.submitting || isFormValid()}
              loading={form.submitting}
            >
              Login
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
