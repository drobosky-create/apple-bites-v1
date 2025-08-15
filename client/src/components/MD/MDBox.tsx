import React from "react";
import { Box, BoxProps } from "@mui/material";

interface MDBoxProps extends BoxProps {
  bgColor?: string;
  shadow?: string;
  borderRadius?: string;
}

const MDBox = React.forwardRef<HTMLDivElement, MDBoxProps>(({
  bgColor = "transparent",
  shadow,
  borderRadius,
  sx,
  ...props
}, ref) => {
  const mdSx = {
    backgroundColor: bgColor === "white" ? "#ffffff" : 
                   bgColor === "transparent" ? "transparent" : 
                   bgColor || "inherit",
    boxShadow: shadow === "lg" ? "0 10px 25px rgba(0,0,0,0.1)" : 
               shadow === "md" ? "0 5px 15px rgba(0,0,0,0.08)" : 
               shadow === "sm" ? "0 2px 8px rgba(0,0,0,0.06)" : 
               shadow || "none",
    borderRadius: borderRadius === "lg" ? "12px" : 
                  borderRadius === "md" ? "8px" : 
                  borderRadius === "sm" ? "4px" : 
                  borderRadius || "0",
    ...sx
  };

  return (
    <Box ref={ref} sx={mdSx} {...props} />
  );
});

MDBox.displayName = "MDBox";

export default MDBox;