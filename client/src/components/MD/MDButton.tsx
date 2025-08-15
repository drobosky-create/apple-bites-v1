import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface MDButtonProps extends ButtonProps {
  variant?: "text" | "outlined" | "contained" | "gradient";
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

const MDButton = React.forwardRef<HTMLButtonElement, MDButtonProps>(({
  variant = "contained",
  color = "primary",
  sx,
  ...props
}, ref) => {
  const getButtonStyles = () => {
    if (variant === "gradient") {
      const gradients = {
        primary: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        info: "linear-gradient(135deg, #0288d1 0%, #0277bd 100%)",
        success: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
        error: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
        warning: "linear-gradient(135deg, #ed6c02 0%, #e65100 100%)",
        secondary: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
      };
      
      return {
        background: gradients[color] || gradients.primary,
        color: "white",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
          transform: "translateY(-1px)",
        },
        transition: "all 0.2s ease-in-out",
      };
    }
    return {};
  };

  const mdSx = {
    textTransform: "none",
    fontWeight: 500,
    ...getButtonStyles(),
    ...sx
  };

  const buttonVariant = variant === "gradient" ? "contained" : variant;

  return (
    <Button 
      ref={ref} 
      variant={buttonVariant} 
      color={color} 
      sx={mdSx} 
      {...props} 
    />
  );
});

MDButton.displayName = "MDButton";

export default MDButton;