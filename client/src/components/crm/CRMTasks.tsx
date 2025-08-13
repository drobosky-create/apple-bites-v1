import React from 'react';
import { Card, CardContent, Checkbox } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { Plus, Clock, User, AlertCircle } from 'lucide-react';

const CRMTasks = () => {
  // Mock tasks data - in real app this would come from API
  const tasks = [
    {
      id: 1,
      title: 'Follow up with ABC Corp',
      description: 'Send proposal follow-up email',
      priority: 'high',
      dueDate: 'Today',
      assignee: 'You',
      completed: false
    },
    {
      id: 2,
      title: 'Prepare valuation report',
      description: 'Complete financial analysis for TechStart Inc',
      priority: 'medium',
      dueDate: 'Tomorrow',
      assignee: 'You',
      completed: false
    },
    {
      id: 3,
      title: 'Schedule client meeting',
      description: 'Coordinate with XYZ Manufacturing for next steps',
      priority: 'low',
      dueDate: 'Friday',
      assignee: 'Sarah Johnson',
      completed: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <MDBox p={3}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Tasks
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Manage your to-do list and assignments
          </MDTypography>
        </MDBox>
        <MDButton variant="gradient" color="info">
          <Plus size={16} />
          &nbsp;New Task
        </MDButton>
      </MDBox>

      <Card>
        <CardContent>
          <MDBox mb={3}>
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              Task List
            </MDTypography>
            
            {tasks.map((task) => (
              <MDBox 
                key={task.id}
                display="flex" 
                alignItems="start" 
                py={2}
                borderBottom="1px solid #f0f0f0"
                opacity={task.completed ? 0.6 : 1}
              >
                <Checkbox 
                  checked={task.completed}
                  size="small"
                  sx={{ mt: 0.5, mr: 2 }}
                />
                
                <MDBox flex={1}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <MDTypography 
                      variant="body2" 
                      fontWeight="bold"
                      sx={{ 
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    >
                      {task.title}
                    </MDTypography>
                    <MDBox 
                      ml={1}
                      px={1}
                      py={0.25}
                      borderRadius="4px"
                      bgcolor={getPriorityColor(task.priority)}
                      display="flex"
                      alignItems="center"
                    >
                      <AlertCircle size={10} color="white" style={{ marginRight: '2px' }} />
                      <MDTypography variant="caption" color="white" textTransform="uppercase">
                        {task.priority}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  
                  <MDTypography variant="body2" color="text" mb={1}>
                    {task.description}
                  </MDTypography>
                  
                  <MDBox display="flex" alignItems="center" gap={2}>
                    <MDBox display="flex" alignItems="center">
                      <Clock size={12} style={{ marginRight: '4px', color: '#666' }} />
                      <MDTypography variant="caption" color="text">
                        Due: {task.dueDate}
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center">
                      <User size={12} style={{ marginRight: '4px', color: '#666' }} />
                      <MDTypography variant="caption" color="text">
                        {task.assignee}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            ))}
          </MDBox>

          <MDBox textAlign="center" py={4} bgcolor="#f8f9fa" borderRadius="8px">
            <MDTypography variant="h6" color="text" mb={1}>
              Task Management System
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={2}>
              Full task management with assignments, deadlines, and project tracking
            </MDTypography>
            <MDButton variant="outlined" color="primary">
              Upgrade Features
            </MDButton>
          </MDBox>
        </CardContent>
      </Card>
    </MDBox>
  );
};

export default CRMTasks;