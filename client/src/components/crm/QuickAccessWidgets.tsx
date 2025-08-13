import React from 'react';
import { Card, CardContent } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { AlertTriangle } from 'lucide-react';

const QuickAccessWidgets = () => {
  const urgentTasks = [
    { task: 'Follow up on GlobalTech proposal response', deadline: 'Today', priority: 'high' },
    { task: 'Prepare due diligence materials for TechCorp', deadline: 'Tomorrow', priority: 'high' },
    { task: 'Schedule investor meeting for RetailPlus', deadline: '2 days', priority: 'medium' },
    { task: 'Review legal documents for FinanceFirst', deadline: '3 days', priority: 'medium' },
  ];

  return (
    <Card sx={{ height: '400px' }}>
      <CardContent>
        <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <MDBox display="flex" alignItems="center">
            <AlertTriangle size={20} color="#F59E0B" />
            <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
              Urgent Tasks
            </MDTypography>
          </MDBox>
          <MDButton 
            size="small" 
            variant="text" 
            sx={{ color: '#3B82F6', minWidth: 'auto', p: 0.5 }}
          >
            View All
          </MDButton>
        </MDBox>
        
        <MDBox sx={{ maxHeight: '320px', overflowY: 'auto' }}>
          {urgentTasks.map((task, index) => (
            <MDBox 
              key={index} 
              p={2} 
              mb={1} 
              sx={{ 
                backgroundColor: task.priority === 'high' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(107, 114, 128, 0.05)',
                borderRadius: '8px',
                borderLeft: `3px solid ${task.priority === 'high' ? '#EF4444' : '#6B7280'}`
              }}
            >
              <MDTypography variant="body2" fontWeight="medium" color="dark" mb={0.5}>
                {task.task}
              </MDTypography>
              <MDBox display="flex" alignItems="center" justifyContent="space-between">
                <MDTypography variant="caption" color="text">
                  Due: {task.deadline}
                </MDTypography>
                <MDBox 
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '4px',
                    backgroundColor: task.priority === 'high' ? '#FEF2F2' : '#F9FAFB',
                    border: `1px solid ${task.priority === 'high' ? '#FECACA' : '#E5E7EB'}`
                  }}
                >
                  <MDTypography 
                    variant="caption" 
                    sx={{ color: task.priority === 'high' ? '#DC2626' : '#6B7280' }}
                    fontWeight="medium"
                    textTransform="uppercase"
                  >
                    {task.priority}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          ))}
        </MDBox>
      </CardContent>
    </Card>
  );
};

export default QuickAccessWidgets;