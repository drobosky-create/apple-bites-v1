import { useEffect } from "react";
import { useLocation } from "wouter";
import { Box } from "@mui/material";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [pathname] = useLocation();

  return (
    <Box
      sx={({ breakpoints, transitions }) => ({
        p: 3,
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",

        [breakpoints.up("xl")]: {
          marginLeft: "280px", // Sidebar width
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </Box>
  );
}