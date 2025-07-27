import { Box, Container } from "@mui/material";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flexGrow={1}>
        <Topbar />
        <Container maxWidth="xl" sx={{ p: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}