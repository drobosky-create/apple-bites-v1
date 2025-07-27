import React, { forwardRef } from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface MDButtonProps extends Omit<ButtonProps, 'color'> {
  color?: "white" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  variant?: "text" | "contained" | "outlined" | "gradient";
  size?: "small" | "medium" | "large";
  circular?: boolean;
  iconOnly?: boolean;
}

const MDButtonRoot = styled(Button)<{ ownerState: MDButtonProps }>(({ theme, ownerState }) => {
  const { palette, functions, borders, boxShadows } = theme as any;
  const { color, variant, size, circular, iconOnly } = ownerState;

  const { white, text, transparent, gradients, grey } = palette;
  const { boxShadow, linearGradient, pxToRem, rgba } = functions || {};
  const { borderRadius } = borders || {};
  const { colored } = boxShadows || {};

  // Size styles
  const sizeStyles = () => {
    const pxToRemFn = pxToRem || ((px: number) => `${px / 16}rem`);
    let sizeValue: any = {};

    if (size === "small") {
      sizeValue = {
        fontSize: pxToRemFn(10),
        padding: `${pxToRemFn(6.2)} ${pxToRemFn(16.5)}`,
      };
    } else if (size === "large") {
      sizeValue = {
        fontSize: pxToRemFn(14),
        padding: `${pxToRemFn(12)} ${pxToRemFn(30)}`,
      };
    } else {
      sizeValue = {
        fontSize: pxToRemFn(12),
        padding: `${pxToRemFn(10.5)} ${pxToRemFn(24)}`,
      };
    }

    if (iconOnly) {
      const buttonSize = pxToRemFn(size === "large" ? 52 : size === "small" ? 30 : 40);
      sizeValue.width = buttonSize;
      sizeValue.height = buttonSize;
      sizeValue.minWidth = buttonSize;
      sizeValue.padding = 0;
    }

    return sizeValue;
  };

  // Gradient styles for variant="gradient"
  const gradientStyles = () => {
    const linearGradientFn = linearGradient || ((c1: string, c2: string) => `linear-gradient(195deg, ${c1}, ${c2})`);
    const backgroundImage = color && gradients?.[color] 
      ? linearGradientFn(gradients[color].main, gradients[color].state)
      : linearGradientFn(gradients?.info?.main || "#1A73E8", gradients?.info?.state || "#1662C4");

    return {
      backgroundImage,
      color: white?.main || "#ffffff",
      border: "none",
      "&:hover": {
        backgroundImage,
        boxShadow: colored?.[color] || colored?.info || "none",
      },
      "&:focus": {
        backgroundImage,
        boxShadow: colored?.[color] || colored?.info || "none",
      },
      "&:active": {
        backgroundImage,
        opacity: 0.85,
      },
      "&:disabled": {
        backgroundImage: linearGradientFn(grey?.[400] || "#bdbdbd", grey?.[400] || "#bdbdbd"),
        color: grey?.[600] || "#757575",
      },
    };
  };

  // Contained styles
  const containedStyles = () => {
    const backgroundValue = palette[color] ? palette[color].main : (white?.main || "#ffffff");
    const colorValue = color === "white" || color === "light" ? (text?.main || "#333") : (white?.main || "#ffffff");

    return {
      backgroundColor: backgroundValue,
      color: colorValue,
      "&:hover": {
        backgroundColor: palette[color]?.dark || backgroundValue,
      },
      "&:focus": {
        backgroundColor: palette[color]?.dark || backgroundValue,
      },
    };
  };

  // Outlined styles
  const outlinedStyles = () => {
    const rgbaFn = rgba || ((c: string, o: number) => c.replace('rgb', 'rgba').replace(')', `, ${o})`));
    const borderColorValue = palette[color] ? palette[color].main : (grey?.[400] || "#bdbdbd");
    const colorValue = palette[color] ? palette[color].main : (grey?.[700] || "#616161");

    return {
      backgroundColor: transparent?.main || "transparent",
      borderColor: borderColorValue,
      color: colorValue,
      "&:hover": {
        backgroundColor: rgbaFn(palette[color]?.main || grey?.[400] || "#bdbdbd", 0.1),
        borderColor: borderColorValue,
      },
      "&:focus": {
        backgroundColor: rgbaFn(palette[color]?.main || grey?.[400] || "#bdbdbd", 0.1),
        borderColor: borderColorValue,
      },
    };
  };

  // Text styles
  const textStyles = () => {
    const rgbaFn = rgba || ((c: string, o: number) => c.replace('rgb', 'rgba').replace(')', `, ${o})`));
    const colorValue = palette[color] ? palette[color].main : (grey?.[700] || "#616161");

    return {
      color: colorValue,
      "&:hover": {
        backgroundColor: rgbaFn(palette[color]?.main || grey?.[400] || "#bdbdbd", 0.1),
      },
      "&:focus": {
        backgroundColor: rgbaFn(palette[color]?.main || grey?.[400] || "#bdbdbd", 0.1),
      },
    };
  };

  return {
    ...sizeStyles(),
    borderRadius: circular ? "50%" : (borderRadius?.lg || "0.5rem"),
    textTransform: "none" as const,
    fontWeight: 700,
    transition: "all 150ms ease-in",
    cursor: "pointer",
    userSelect: "none" as const,
    ...(variant === "gradient" && gradientStyles()),
    ...(variant === "contained" && containedStyles()),
    ...(variant === "outlined" && outlinedStyles()),
    ...(variant === "text" && textStyles()),
  };
});

const MDButton = forwardRef<HTMLButtonElement, MDButtonProps>(
  ({ 
    color = "info", 
    variant = "contained", 
    size = "medium", 
    circular = false, 
    iconOnly = false, 
    children, 
    ...rest 
  }, ref) => (
    <MDButtonRoot
      {...rest}
      ref={ref}
      variant={variant === "gradient" ? "contained" : variant}
      size={size}
      ownerState={{ color, variant, size, circular, iconOnly }}
    >
      {children}
    </MDButtonRoot>
  )
);

MDButton.displayName = "MDButton";

export default MDButton;