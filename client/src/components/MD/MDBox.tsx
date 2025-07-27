import React, { forwardRef } from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MDBoxProps extends Omit<BoxProps, 'color'> {
  variant?: "contained" | "gradient";
  bgColor?: string;
  color?: string;
  opacity?: number;
  borderRadius?: string;
  shadow?: string;
  coloredShadow?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "none";
}

const MDBoxRoot = styled(Box)<{ ownerState: MDBoxProps }>(({ theme, ownerState }) => {
  const { palette, functions, borders, boxShadows } = theme as any;
  const { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow } = ownerState;

  const { gradients, grey, white } = palette;
  const { linearGradient } = functions || {};
  const { borderRadius: radius } = borders || {};

  // Background color logic
  let backgroundValue = "transparent";
  
  if (variant === "gradient" && bgColor && gradients?.[bgColor]) {
    backgroundValue = linearGradient ? linearGradient(gradients[bgColor].main, gradients[bgColor].state) : bgColor;
  } else if (bgColor === "white") {
    backgroundValue = white?.main || "#ffffff";
  } else if (bgColor && palette[bgColor]) {
    backgroundValue = palette[bgColor].main;
  } else if (bgColor) {
    backgroundValue = bgColor;
  }

  // Border radius logic
  let borderRadiusValue = "0px";
  if (radius) {
    if (borderRadius === "xs") borderRadiusValue = radius.xs || "0.125rem";
    else if (borderRadius === "sm") borderRadiusValue = radius.sm || "0.25rem";
    else if (borderRadius === "md") borderRadiusValue = radius.md || "0.375rem";
    else if (borderRadius === "lg") borderRadiusValue = radius.lg || "0.5rem";
    else if (borderRadius === "xl") borderRadiusValue = radius.xl || "0.75rem";
    else if (borderRadius === "xxl") borderRadiusValue = radius.xxl || "1.25rem";
    else if (borderRadius === "section") borderRadiusValue = radius.section || "1.5rem";
  }
  if (borderRadius && !borderRadiusValue.startsWith("0")) borderRadiusValue = borderRadius;

  // Shadow logic
  let boxShadowValue = "none";
  if (boxShadows) {
    if (shadow === "xs") boxShadowValue = boxShadows.xs || "0 2px 9px -5px rgba(0, 0, 0, 0.15)";
    else if (shadow === "sm") boxShadowValue = boxShadows.sm || "0 5px 13px -5px rgba(0, 0, 0, 0.20)";
    else if (shadow === "md") boxShadowValue = boxShadows.md || "0 8px 26px -4px rgba(0, 0, 0, 0.15)";
    else if (shadow === "lg") boxShadowValue = boxShadows.lg || "0 23px 45px -11px rgba(0, 0, 0, 0.25)";
    else if (shadow === "xl") boxShadowValue = boxShadows.xl || "0 35px 65px -12px rgba(0, 0, 0, 0.35)";
    else if (shadow === "xxl") boxShadowValue = boxShadows.xxl || "0 54px 100px -12px rgba(0, 0, 0, 0.35)";
    else if (shadow === "inset") boxShadowValue = boxShadows.inset || "inset 0 1px 2px rgba(0, 0, 0, 0.075)";

    // Colored shadow logic
    if (coloredShadow && coloredShadow !== "none" && boxShadows.colored?.[coloredShadow]) {
      boxShadowValue = boxShadows.colored[coloredShadow];
    }
  }

  return {
    opacity,
    background: backgroundValue,
    borderRadius: borderRadiusValue,
    boxShadow: boxShadowValue,
  };
});

const MDBox = forwardRef<HTMLDivElement, MDBoxProps>(
  ({ variant = "contained", bgColor = "transparent", color = "dark", opacity = 1, borderRadius = "none", shadow = "none", coloredShadow = "none", ...rest }, ref) => (
    <MDBoxRoot
      {...rest}
      ref={ref}
      ownerState={{ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow }}
    />
  )
);

MDBox.displayName = "MDBox";

export default MDBox;