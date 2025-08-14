import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider
} from '@mui/material';

interface MaterialDashboardCardProps {
  title: string;
  count: string | number;
  icon: React.ReactNode;
  color: string;
  percentage?: {
    amount: string;
    color: 'success' | 'error' | 'warning';
    label: string;
  };
}

const MaterialDashboardCard: React.FC<MaterialDashboardCardProps> = ({ 
  title, 
  count, 
  icon, 
  color, 
  percentage 
}) => {
  const getGradientByColor = (colorName: string) => {
    switch (colorName) {
      case 'primary': return 'linear-gradient(195deg, #0b2147, #07152E)';
      case 'success': return 'linear-gradient(195deg, #16A34A, #15803D)';
      case 'info': return 'linear-gradient(195deg, #005b8c, #004662)';
      case 'warning': return 'linear-gradient(195deg, #F59E0B, #D97706)';
      case 'error': return 'linear-gradient(195deg, #DC2626, #B91C1C)';
      case 'dark': return 'linear-gradient(195deg, #0b2147, #07152E)';
      default: return 'linear-gradient(195deg, #005b8c, #004662)';
    }
  };

  const getShadowByColor = (colorName: string) => {
    switch (colorName) {
      case 'primary': return '0 4px 20px 0 rgba(11, 33, 71, 0.14), 0 7px 10px -5px rgba(11, 33, 71, 0.4)';
      case 'success': return '0 4px 20px 0 rgba(22, 163, 74, 0.14), 0 7px 10px -5px rgba(21, 128, 61, 0.4)';
      case 'info': return '0 4px 20px 0 rgba(0, 91, 140, 0.14), 0 7px 10px -5px rgba(0, 70, 98, 0.4)';
      case 'warning': return '0 4px 20px 0 rgba(245, 158, 11, 0.14), 0 7px 10px -5px rgba(217, 119, 6, 0.4)';
      case 'error': return '0 4px 20px 0 rgba(220, 38, 38, 0.14), 0 7px 10px -5px rgba(185, 28, 28, 0.4)';
      case 'dark': return '0 4px 20px 0 rgba(11, 33, 71, 0.14), 0 7px 10px -5px rgba(11, 33, 71, 0.4)';
      default: return '0 4px 20px 0 rgba(0, 91, 140, 0.14), 0 7px 10px -5px rgba(0, 70, 98, 0.4)';
    }
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, px: 2 }}>
        <Box
          sx={{
            background: getGradientByColor(color),
            color: 'white',
            borderRadius: '0.75rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '4rem',
            height: '4rem',
            mt: -3,
            boxShadow: getShadowByColor(color),
            '& svg': {
              fontSize: '1.5rem'
            }
          }}
        >
          {icon}
        </Box>
        <Box sx={{ textAlign: 'right', lineHeight: 1.25 }}>
          <Typography
            variant="button"
            sx={{
              fontWeight: 300,
              color: '#7b809a',
              fontSize: '0.875rem',
              textTransform: 'capitalize'
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#344767',
              fontSize: '1.625rem',
              lineHeight: 1.25
            }}
          >
            {count}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ pb: 2, px: 2 }}>
        <Typography
          component="p"
          variant="button"
          sx={{
            color: '#7b809a',
            display: 'flex',
            fontSize: '0.875rem',
            lineHeight: 1.625
          }}
        >
          {percentage && (
            <Typography
              component="span"
              variant="button"
              sx={{
                fontWeight: 700,
                color: percentage.color === 'success' ? '#16A34A' :
                       percentage.color === 'error' ? '#DC2626' :
                       percentage.color === 'warning' ? '#F59E0B' : '#16A34A'
              }}
            >
              {percentage.amount}
            </Typography>
          )}
          {percentage && `\u00A0${percentage.label}`}
        </Typography>
      </Box>
    </Card>
  );
};

export default MaterialDashboardCard;