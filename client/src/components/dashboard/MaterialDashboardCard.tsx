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
      case 'primary': return 'linear-gradient(195deg, #42424a, #191919)';
      case 'success': return 'linear-gradient(195deg, #66bb6a, #43a047)';
      case 'info': return 'linear-gradient(195deg, #49a3f1, #1a73e8)';
      case 'warning': return 'linear-gradient(195deg, #ffa726, #fb8c00)';
      case 'error': return 'linear-gradient(195deg, #ef5350, #e53935)';
      case 'dark': return 'linear-gradient(195deg, #42424a, #191919)';
      default: return 'linear-gradient(195deg, #66bb6a, #43a047)';
    }
  };

  const getShadowByColor = (colorName: string) => {
    switch (colorName) {
      case 'primary': return '0 4px 20px 0 rgba(66, 66, 74, 0.14), 0 7px 10px -5px rgba(66, 66, 74, 0.4)';
      case 'success': return '0 4px 20px 0 rgba(102, 187, 106, 0.14), 0 7px 10px -5px rgba(76, 175, 80, 0.4)';
      case 'info': return '0 4px 20px 0 rgba(73, 163, 241, 0.14), 0 7px 10px -5px rgba(26, 115, 232, 0.4)';
      case 'warning': return '0 4px 20px 0 rgba(255, 167, 38, 0.14), 0 7px 10px -5px rgba(251, 140, 0, 0.4)';
      case 'error': return '0 4px 20px 0 rgba(239, 83, 80, 0.14), 0 7px 10px -5px rgba(229, 57, 53, 0.4)';
      case 'dark': return '0 4px 20px 0 rgba(66, 66, 74, 0.14), 0 7px 10px -5px rgba(66, 66, 74, 0.4)';
      default: return '0 4px 20px 0 rgba(102, 187, 106, 0.14), 0 7px 10px -5px rgba(76, 175, 80, 0.4)';
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
                color: percentage.color === 'success' ? '#4caf50' :
                       percentage.color === 'error' ? '#f44336' :
                       percentage.color === 'warning' ? '#ffa726' : '#4caf50'
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