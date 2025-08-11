import {
  Burger,
  Button,
  Drawer,
  Flex,
  Group,
  Image,
  Stack,
  useMantineTheme,
  Avatar, // <-- import Avatar
  UnstyledButton, // <-- for clickable avatar without default styles
} from "@mantine/core";
import { NavLink, useNavigate } from "react-router";
import AuthService from "../features/auth/services/auth.service.js";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useAuth } from "../features/auth/providers/AuthProvider.jsx";

export default function Navbar() {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { isAuth, setIsAuth, setUser, user } = useAuth(); // assuming you have user info here
  const navigate = useNavigate();

  console.log("NAVBAR USER: " + JSON.stringify(user));

  const handleLogout = () => {
    AuthService.signout();
    setIsAuth(false);
    setUser(null);
    setOpened(false);
    navigate("/login");
  };

  return (
    <Group h="100%" px="md">
      <Flex justify="space-between" align="center" w="100%" px="md">
        <NavLink to="/">
          <Image src="src/assets/logo.svg" w="50%" />
        </NavLink>

        {/* Desktop Navigation Buttons */}
        {!isMobile && (
          <Group spacing="sm" align="center">
            {!isAuth ? (
              <>
                <NavLink to="/signup">
                  <Button variant="gradient">Sign Up</Button>
                </NavLink>
                <NavLink to="/login">
                  <Button variant="outline">Login</Button>
                </NavLink>
              </>
            ) : (
              <>
                {/* Avatar clickable to profile */}
                <UnstyledButton
                  onClick={() => navigate("/profile")}
                  style={{ borderRadius: "50%" }}
                >
                  <Avatar
                    src={user?.avatar} // adjust if you have avatar URL in user object
                    alt={user?.name || "User avatar"}
                    radius="xl"
                    size={40}
                  />
                </UnstyledButton>

                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Group>
        )}

        {/* Burger for Mobile */}
        {isMobile && (
          <>
            <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
            <Drawer
              opened={opened}
              onClose={() => setOpened(false)}
              title="Menu"
              padding="md"
              size="xs"
            >
              <Stack>
                {!isAuth ? (
                  <>
                    <NavLink to="/signup" onClick={() => setOpened(false)}>
                      <Button variant="gradient" fullWidth>
                        Sign Up
                      </Button>
                    </NavLink>
                    <NavLink to="/login" onClick={() => setOpened(false)}>
                      <Button fullWidth variant="outline">
                        Login
                      </Button>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <UnstyledButton
                      onClick={() => {
                        navigate("/profile");
                        setOpened(false);
                      }}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        src={user?.avatar}
                        alt={user?.name || "User avatar"}
                        radius="xl"
                        size={60}
                      />
                    </UnstyledButton>

                    <Button variant="outline" fullWidth onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )}
              </Stack>
            </Drawer>
          </>
        )}
      </Flex>
    </Group>
  );
}
