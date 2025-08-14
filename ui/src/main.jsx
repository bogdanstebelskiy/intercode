import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { MantineProvider } from "@mantine/core";
import MainLayout from "./layouts/MainLayout.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import RecipesListPage from "./features/recipies/pages/RecipesListPage.jsx";
import { AuthProvider } from "./features/auth/providers/AuthProvider.jsx";
import { Notifications } from "@mantine/notifications";
import DetailRecipePage from "./features/recipies/pages/DetailRecipePage.jsx";
import UserProfilePage from "./features/user/pages/UserProfilePage.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <MantineProvider>
      <Notifications />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<RecipesListPage />} />
            <Route path="/recipe/:recipeId" element={<DetailRecipePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<RegisterPage />} />
            <Route path="profile/:userId" element={<UserProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </AuthProvider>,
);
