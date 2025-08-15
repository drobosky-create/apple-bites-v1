import React from "react";
import { Typography, TypographyProps } from "@mui/material";

interface MDTypographyProps extends TypographyProps {
  fontWeight?: string | number;
  opacity?: number;
}

const MDTypography = React.forwardRef<HTMLSpanElement, MDTypographyProps>(({
  fontWeight = "normal",
  opacity,
  sx,
  ...props
}, ref) => {
  const mdSx = {
    fontWeight: fontWeight === "bold" ? 700 : 
                fontWeight === "medium" ? 500 : 
                fontWeight === "regular" ? 400 : 
                fontWeight === "light" ? 300 :
                fontWeight || 400,
    opacity: opacity || 1,
    ...sx
  };

  return (
    <Typography ref={ref} sx={mdSx} {...props} />
  );
});

MDTypography.displayName = "MDTypography";

export default MDTypography;