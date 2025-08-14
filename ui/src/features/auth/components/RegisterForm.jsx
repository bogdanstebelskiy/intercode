import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "@mantine/form";
import {
  Card,
  Title,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
  Flex,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getPhotoUrl } from "../../upload/utils/helpers.js";
import AuthService from "../services/auth.service.js";
import Dropzone from "../../../components/Dropzone.jsx";
import { useRecaptcha } from "../hooks/useRecaptcha.js";

export default function RegisterForm() {
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
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      userName: "",
      password: "",
      confirmPassword: "",
      avatar: "",
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
      avatar: (val) => {
        if (!val) {
          return "Avatar photo is required";
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
            return "Avatar must be a JPEG, PNG, or WebP image";
          }

          if (val.size > maxSize) {
            return "Avatar size must be less than 5MB";
          }
        }

        if (typeof val === "string" && val.trim().length === 0) {
          return "Avatar is required";
        }

        return null;
      },
    },
  });

  const handleSingup = async (values) => {
    setRecaptchaError("");

    if (!validateRecaptcha()) {
      return;
    }

    try {
      const uploadedAvatarUrl = await getPhotoUrl(values.avatar);

      const success = await AuthService.signup(
        values.userName,
        values.password,
        uploadedAvatarUrl,
        recaptchaValue,
      );

      if (!success) {
        notifications.show({
          title: "Couldn't register",
          message: "Something went wrong",
          color: "red",
        });

        setRecaptchaValue(null);
        recaptchaRef.current?.reset();
        return;
      }

      form.reset();
      setRecaptchaValue(null);
      recaptchaRef.current?.reset();

      notifications.show({
        title: "Registration successful",
        message: "You can now log in with your credentials.",
        color: "green",
      });
    } catch (error) {
      setRecaptchaValue(null);
      recaptchaRef.current?.reset();

      notifications.show({
        title: "Registration failed",
        message: "Please try again",
        color: "red",
      });
    }
  };

  const isFormValid = () => {
    return (
      !form.isDirty() || Object.keys(form.errors).length > 0 || !recaptchaValue
    );
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

          <Dropzone
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
              marginTop: "10px",
            }}
            value={form.values.avatar}
            onChange={(file) => form.setFieldValue("avatar", file)}
            error={form.errors.avatar}
            {...form.getInputProps("avatar")}
          />

          <Flex justify="center" align="center">
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
              Signup
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
