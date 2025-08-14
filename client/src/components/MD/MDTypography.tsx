import React, { forwardRef } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MDTypographyProps extends TypographyProps {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "white" | "text" | "light";
  fontWeight?: "light" | "regular" | "medium" | "bold";
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
}

const MDTypographyRoot = styled(Typography)<{ mdProps: MDTypographyProps }>(({ theme, mdProps }) => {
  const { color, fontWeight, textTransform } = mdProps;

  const colors = {
    primary: "#0b2147",
    secondary: "#005b8c",
    info: "#4493de",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",
    dark: "#0b2147",
    white: "#ffffff",
    text: "#344767",
    light: "#f0f2f5",
  };

  const fontWeights = {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  };

  return {
    color: color && colors[color] ? colors[color] : "inherit",
    fontWeight: fontWeight ? fontWeights[fontWeight] : "inherit",
    textTransform: textTransform || "none",
    opacity: 1,
  };
});

const MDTypography = forwardRef<HTMLElement, MDTypographyProps>(
  ({ color = "dark", fontWeight = "regular", textTransform = "none", children, ...rest }, ref) => {
    return (
      <MDTypographyRoot
        {...rest}
        ref={ref}
        mdProps={{ color, fontWeight, textTransform }}
      >
        {children}
      </MDTypographyRoot>
    );
  }
);

MDTypography.displayName = "MDTypography";

export default MDTypography;