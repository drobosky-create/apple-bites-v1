import React, { forwardRef } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MDTypographyProps extends Omit<TypographyProps, 'color'> {
  color?: "inherit" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "text" | "white";
  fontWeight?: "light" | "regular" | "medium" | "bold" | false;
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  verticalAlign?: "unset" | "baseline" | "sub" | "super" | "text-top" | "text-bottom" | "middle" | "top" | "bottom";
  textGradient?: boolean;
  opacity?: number;
}

const MDTypographyRoot = styled(Typography)<{ ownerState: MDTypographyProps }>(({ theme, ownerState }) => {
  const { palette, typography, functions } = theme as any;
  const { color, textTransform, verticalAlign, fontWeight, opacity, textGradient } = ownerState;

  const { gradients, transparent, white } = palette;
  const { fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold } = typography;
  const { linearGradient } = functions || {};

  // Font weight mapping
  const fontWeights = {
    light: fontWeightLight,
    regular: fontWeightRegular,
    medium: fontWeightMedium,
    bold: fontWeightBold,
  };

  // Gradient styles
  const gradientStyles = () => ({
    backgroundImage:
      color !== "inherit" && color !== "text" && color !== "white" && gradients?.[color] && linearGradient
        ? linearGradient(gradients[color].main, gradients[color].state)
        : linearGradient ? linearGradient(gradients?.dark?.main || "#42424a", gradients?.dark?.state || "#191919") : "none",
    display: "inline-block",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: transparent?.main || "transparent",
    position: "relative" as const,
    zIndex: 1,
  });

  // Color logic
  let colorValue = "inherit";
  
  if (color === "inherit") {
    colorValue = "inherit";
  } else if (color === "text") {
    colorValue = palette.text?.main || "#333";
  } else if (color === "white") {
    colorValue = white?.main || "#ffffff";
  } else if (color === "dark") {
    colorValue = palette.grey?.[700] || "#424242";
  } else if (color && palette[color]) {
    colorValue = palette[color].main;
  }

  return {
    opacity,
    textTransform,
    verticalAlign,
    textDecoration: "none",
    color: colorValue,
    fontWeight: fontWeight && fontWeights[fontWeight] ? fontWeights[fontWeight] : undefined,
    ...(textGradient && gradientStyles()),
  };
});

const MDTypography = forwardRef<HTMLSpanElement, MDTypographyProps>(
  ({ 
    color = "dark", 
    fontWeight = false, 
    textTransform = "none", 
    verticalAlign = "unset", 
    textGradient = false, 
    opacity = 1, 
    children, 
    ...rest 
  }, ref) => (
    <MDTypographyRoot
      {...rest}
      ref={ref}
      ownerState={{ color, fontWeight, textTransform, verticalAlign, textGradient, opacity }}
    >
      {children}
    </MDTypographyRoot>
  )
);

MDTypography.displayName = "MDTypography";

export default MDTypography;