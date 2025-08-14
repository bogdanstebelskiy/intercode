import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Navbar from "../components/Navbar.jsx";
import ScrollTopButton from "../components/ScrollTopButton.jsx";

const MainLayout = () => {
  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Navbar />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <ScrollTopButton />
    </AppShell>
  );
};

export default MainLayout;
