import React from 'react';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card as MuiCard,
  Paper,
  Container,
  Divider,
  IconButton,
  Chip,
  Badge,
  Avatar,
} from '@mui/material';

// ##############################
// Material Dashboard Color System
// ##############################

const hexToRgb = (input: string): string => {
  input = input + "";
  input = input.replace("#", "");
  let hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error("input is not a valid hex color.");
  }
  if (input.length === 3) {
    let first = input[0];
    let second = input[1];
    let last = input[2];
    input = first + first + second + second + last + last;
  }
  input = input.toUpperCase();
  let first = input[0] + input[1];
  let second = input[2] + input[3];
  let last = input[4] + input[5];
  return (
    parseInt(first, 16) +
    ", " +
    parseInt(second, 16) +
    ", " +
    parseInt(last, 16)
  );
};

// Material Dashboard Brand Colors
export const materialColors = {
  primary: ["#9c27b0", "#ab47bc", "#8e24aa", "#af2cc5"],
  warning: ["#ff9800", "#ffa726", "#fb8c00", "#ffa21a"],
  danger: ["#f44336", "#ef5350", "#e53935", "#f55a4e"],
  success: ["#4caf50", "#66bb6a", "#43a047", "#5cb860"],
  info: ["#00acc1", "#26c6da", "#00acc1", "#00d3ee"],
  rose: ["#e91e63", "#ec407a", "#d81b60", "#eb3573"],
  gray: [
    "#999",
    "#777",
    "#3C4858",
    "#AAAAAA",
    "#D2D2D2",
    "#DDD",
    "#b4b4b4",
    "#555555",
    "#333",
    "#a9afbb",
    "#eee",
    "#e7e7e7",
    "#212121",
    "#263238",
  ],
  black: "#000",
  white: "#FFF",
};

// Apple Bites Brand Integration (merging with Material Dashboard)
export const appleColors = {
  // Keep Apple Bites navy as primary
  primary: ["#0b2147", "#1a365d", "#081729", "#2a4a6b"],
  // Apple Bites teal as secondary
  secondary: ["#81e5d8", "#a3ebe1", "#4ecdc4", "#26d0ce"],
  // Apple Bites blue as accent
  accent: ["#4493de", "#6ba8e5", "#2d7bd8", "#1976d2"],
  // Keep Material Dashboard colors for status
  warning: materialColors.warning,
  danger: materialColors.danger,
  success: materialColors.success,
  info: materialColors.info,
  rose: materialColors.rose,
  gray: materialColors.gray,
  black: materialColors.black,
  white: materialColors.white,
};

// Box Shadow System
const createBoxShadow = (color: string) => ({
  boxShadow: `0 4px 20px 0 rgba(${hexToRgb(materialColors.black)},.14), 0 7px 10px -5px rgba(${hexToRgb(color)},.4)`
});

export const boxShadows = {
  default: {
    boxShadow: `0 10px 30px -12px rgba(${hexToRgb(materialColors.black)}, 0.42), 0 4px 25px 0px rgba(${hexToRgb(materialColors.black)}, 0.12), 0 8px 10px -5px rgba(${hexToRgb(materialColors.black)}, 0.2)`
  },
  primary: createBoxShadow(appleColors.primary[0]),
  secondary: createBoxShadow(appleColors.secondary[0]),
  accent: createBoxShadow(appleColors.accent[0]),
  success: createBoxShadow(appleColors.success[0]),
  warning: createBoxShadow(appleColors.warning[0]),
  danger: createBoxShadow(appleColors.danger[0]),
  info: createBoxShadow(appleColors.info[0]),
  rose: createBoxShadow(appleColors.rose[0]),
};

// Card Header Gradients
export const cardHeaders = {
  primary: {
    background: `linear-gradient(60deg, ${appleColors.primary[1]}, ${appleColors.primary[2]})`,
    ...boxShadows.primary,
  },
  secondary: {
    background: `linear-gradient(60deg, ${appleColors.secondary[1]}, ${appleColors.secondary[2]})`,
    ...boxShadows.secondary,
  },
  accent: {
    background: `linear-gradient(60deg, ${appleColors.accent[1]}, ${appleColors.accent[2]})`,
    ...boxShadows.accent,
  },
  success: {
    background: `linear-gradient(60deg, ${appleColors.success[1]}, ${appleColors.success[2]})`,
    ...boxShadows.success,
  },
  warning: {
    background: `linear-gradient(60deg, ${appleColors.warning[1]}, ${appleColors.warning[2]})`,
    ...boxShadows.warning,
  },
  danger: {
    background: `linear-gradient(60deg, ${appleColors.danger[1]}, ${appleColors.danger[2]})`,
    ...boxShadows.danger,
  },
  info: {
    background: `linear-gradient(60deg, ${appleColors.info[1]}, ${appleColors.info[2]})`,
    ...boxShadows.info,
  },
  rose: {
    background: `linear-gradient(60deg, ${appleColors.rose[1]}, ${appleColors.rose[2]})`,
    ...boxShadows.rose,
  },
};

// Typography System
export const materialTypography = {
  defaultFont: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 300,
    lineHeight: '1.5em',
  },
  title: {
    color: appleColors.gray[2],
    textDecoration: 'none',
    fontWeight: 300,
    marginTop: '30px',
    marginBottom: '25px',
    minHeight: '32px',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  cardTitle: {
    color: appleColors.gray[2],
    marginTop: 0,
    marginBottom: '3px',
    minHeight: 'auto',
    fontWeight: 300,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
};

// ##############################
// Material Dashboard Components
// ##############################

interface CardProps {
  children: React.ReactNode;
  className?: string;
  plain?: boolean;
  profile?: boolean;
  chart?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'rose';
}

export const MaterialCard = styled(({ children, className, plain, profile, chart, color, ...rest }: CardProps) => {
  const cardClasses = classNames({
    'material-card': true,
    'material-card-plain': plain,
    'material-card-profile': profile,
    'material-card-chart': chart,
    [className || '']: className !== undefined,
  });

  return (
    <Box className={cardClasses} {...rest}>
      {children}
    </Box>
  );
})(({ theme, plain, profile, chart }) => ({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  margin: '25px 0',
  boxShadow: `0 1px 4px 0 rgba(${hexToRgb(materialColors.black)}, 0.14)`,
  borderRadius: '3px',
  color: `rgba(${hexToRgb(materialColors.black)}, 0.87)`,
  background: materialColors.white,
  ...(plain && {
    background: 'transparent',
    boxShadow: 'none',
  }),
  ...(profile && {
    marginTop: '30px',
    textAlign: 'center',
  }),
  ...(chart && {
    '& .material-card-header': {
      position: 'relative',
    },
  }),
}));

interface MaterialCardHeaderProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'rose';
  plain?: boolean;
  stats?: boolean;
  icon?: boolean;
  className?: string;
}

export const MaterialCardHeader = styled(({ children, color = 'primary', plain, stats, icon, className, ...rest }: MaterialCardHeaderProps) => {
  const headerClasses = classNames({
    'material-card-header': true,
    [`material-card-header-${color}`]: color && !plain,
    'material-card-header-plain': plain,
    'material-card-header-stats': stats,
    'material-card-header-icon': icon,
    [className || '']: className !== undefined,
  });

  return (
    <Box className={headerClasses} {...rest}>
      {children}
    </Box>
  );
})(({ theme, color = 'primary', plain, stats, icon }) => ({
  margin: '-20px 15px 0',
  borderRadius: '3px',
  padding: '15px',
  ...(plain ? {
    marginLeft: '0px',
    marginRight: '0px',
    background: 'transparent',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
  } : cardHeaders[color]),
  ...(stats && {
    '& .material-card-header-icon': {
      textAlign: 'center',
      flex: '0 0 auto',
      width: '70px',
      height: '70px',
      margin: '-10px auto 0',
      borderRadius: '3px',
      background: `linear-gradient(60deg, ${appleColors.gray[1]}, ${appleColors.gray[2]})`,
      ...boxShadows.default,
    },
  }),
  ...(icon && {
    float: 'left',
    padding: '15px',
    marginTop: '-20px',
    marginRight: '15px',
  }),
}));

export const MaterialCardBody = styled(Box)(({ theme }) => ({
  padding: '0.9375rem 1.875rem',
  flex: '1 1 auto',
  position: 'relative',
}));

export const MaterialCardFooter = styled(Box)(({ theme }) => ({
  margin: '0 20px 10px',
  paddingTop: '10px',
  borderTop: `1px solid ${appleColors.gray[10]}`,
  height: 'auto',
  ...materialTypography.defaultFont,
}));

interface MaterialButtonProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'rose' | 'white' | 'transparent';
  size?: 'sm' | 'lg';
  simple?: boolean;
  round?: boolean;
  disabled?: boolean;
  block?: boolean;
  link?: boolean;
  justIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MaterialButton = styled(({ children, color = 'primary', size, simple, round, disabled, block, link, justIcon, className, onClick, ...rest }: MaterialButtonProps) => {
  const btnClasses = classNames({
    'material-button': true,
    [`material-button-${color}`]: color,
    [`material-button-${size}`]: size,
    'material-button-round': round,
    'material-button-simple': simple,
    'material-button-disabled': disabled,
    'material-button-block': block,
    'material-button-link': link,
    'material-button-just-icon': justIcon,
    [className || '']: className !== undefined,
  });

  return (
    <Button className={btnClasses} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </Button>
  );
})(({ theme, color = 'primary', size, simple, round, disabled, block, link, justIcon }) => {
  const getColorStyles = () => {
    const colors = appleColors[color as keyof typeof appleColors] || appleColors.primary;
    
    if (simple) {
      return {
        color: Array.isArray(colors) ? colors[0] : colors,
        background: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          background: 'transparent',
          color: Array.isArray(colors) ? colors[0] : colors,
        },
      };
    }

    if (link) {
      return {
        color: Array.isArray(colors) ? colors[0] : colors,
        background: 'transparent',
        '&:hover': {
          background: 'transparent',
          color: Array.isArray(colors) ? colors[1] : colors,
        },
      };
    }

    return {
      background: Array.isArray(colors) ? `linear-gradient(60deg, ${colors[1]}, ${colors[2]})` : colors,
      ...boxShadows[color as keyof typeof boxShadows] || boxShadows.default,
      color: materialColors.white,
      '&:hover': {
        background: Array.isArray(colors) ? `linear-gradient(60deg, ${colors[2]}, ${colors[3] || colors[1]})` : colors,
        ...boxShadows[color as keyof typeof boxShadows] || boxShadows.default,
        transform: 'translate3d(0, -1px, 0)',
      },
    };
  };

  return {
    border: 'none',
    borderRadius: round ? '30px' : '3px',
    position: 'relative',
    padding: size === 'lg' ? '1.125rem 2.25rem' : size === 'sm' ? '0.40625rem 1.25rem' : '0.75rem 1.875rem',
    margin: '.3125rem 1px',
    fontSize: size === 'lg' ? '0.875rem' : size === 'sm' ? '0.6875rem' : '0.75rem',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0',
    willChange: 'box-shadow, transform',
    transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1.42857143',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
    cursor: 'pointer',
    ...getColorStyles(),
    ...(block && {
      width: '100%',
    }),
    ...(justIcon && {
      fontWeight: 400,
      fontSize: '20px',
      height: '41px',
      minWidth: '41px',
      width: '41px',
      borderRadius: round ? '50%' : '3px',
      lineHeight: '24px',
      '& .material-icons': {
        position: 'relative',
        display: 'inline-block',
        top: '0',
        fontSize: '24px',
      },
    }),
    ...(disabled && {
      opacity: 0.65,
      pointerEvents: 'none',
    }),
  };
});

// Material Dashboard TextField
export const MaterialTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '3px',
    backgroundColor: 'transparent',
    '& fieldset': {
      borderColor: appleColors.gray[5],
    },
    '&:hover fieldset': {
      borderColor: appleColors.gray[4],
    },
    '&.Mui-focused fieldset': {
      borderColor: appleColors.primary[0],
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: appleColors.gray[1],
    ...materialTypography.defaultFont,
    '&.Mui-focused': {
      color: appleColors.primary[0],
    },
  },
  '& .MuiFormHelperText-root': {
    color: appleColors.gray[1],
    ...materialTypography.defaultFont,
  },
}));

// Material Dashboard Typography
export const MaterialTitle = styled(Typography)(({ theme }) => ({
  ...materialTypography.title,
  fontSize: '1.3125rem',
  '& small': {
    color: appleColors.gray[1],
    fontWeight: 400,
    lineHeight: 1,
  },
}));

export const MaterialCardTitle = styled(Typography)(({ theme }) => ({
  ...materialTypography.cardTitle,
  fontSize: '1.125rem',
}));

// Background wrapper for consistency
export const MaterialBackground = styled(Box)(({ theme }) => ({
  background: '#fafafa',
  minHeight: '100vh',
  position: 'relative',
}));

// Container with proper spacing
export const MaterialContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
  paddingTop: '30px',
  paddingBottom: '30px',
}));

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'rose';
  footer?: React.ReactNode;
}

export const MaterialStatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  footer 
}) => {
  return (
    <MaterialCard>
      <MaterialCardHeader color={color} stats icon>
        <Box className="material-card-header-icon">
          {icon}
        </Box>
        <Typography variant="body2" sx={{ color: appleColors.gray[1] }}>
          {title}
        </Typography>
        <MaterialCardTitle variant="h4">
          {value}
        </MaterialCardTitle>
      </MaterialCardHeader>
      {footer && (
        <MaterialCardFooter>
          {footer}
        </MaterialCardFooter>
      )}
    </MaterialCard>
  );
};

export default {
  materialColors,
  appleColors,
  boxShadows,
  cardHeaders,
  materialTypography,
  MaterialCard,
  MaterialCardHeader,
  MaterialCardBody,
  MaterialCardFooter,
  MaterialButton,
  MaterialTextField,
  MaterialTitle,
  MaterialCardTitle,
  MaterialBackground,
  MaterialContainer,
  MaterialStatsCard,
};