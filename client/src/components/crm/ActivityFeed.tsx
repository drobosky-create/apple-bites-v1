import React from 'react';
import { Card, CardContent } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import { Activity, User, Building2, DollarSign, Mail, Phone, Calendar } from 'lucide-react';

const ActivityFeed = () => {
  // Mock activity data - in real app this would come from API
  const activities = [
    {
      id: 1,
      type: 'contact_created',
      description: 'New contact added: John Smith',
      timestamp: '2 hours ago',
      icon: User,
      color: '#1976d2'
    },
    {
      id: 2,
      type: 'deal_moved',
      description: 'Deal moved to negotiation: $250K M&A Transaction',
      timestamp: '4 hours ago',
      icon: DollarSign,
      color: '#ed6c02'
    },
    {
      id: 3,
      type: 'firm_updated',
      description: 'Firm profile updated: TechCorp Solutions',
      timestamp: '6 hours ago',
      icon: Building2,
      color: '#2e7d32'
    },
    {
      id: 4,
      type: 'email_sent',
      description: 'Email campaign sent to 15 prospects',
      timestamp: '8 hours ago',
      icon: Mail,
      color: '#9c27b0'
    },
    {
      id: 5,
      type: 'call_logged',
      description: 'Call completed with ABC Manufacturing',
      timestamp: '1 day ago',
      icon: Phone,
      color: '#f57c00'
    },
    {
      id: 6,
      type: 'meeting_scheduled',
      description: 'Meeting scheduled with potential client',
      timestamp: '1 day ago',
      icon: Calendar,
      color: '#795548'
    }
  ];

  return (
    <MDBox p={3}>
      <MDBox mb={3}>
        <MDTypography variant="h4" fontWeight="bold" color="dark">
          Activity Feed
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Recent activity and system updates
        </MDTypography>
      </MDBox>

      <Card>
        <CardContent>
          <MDBox>
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <MDBox 
                  key={activity.id}
                  display="flex" 
                  alignItems="center" 
                  py={2}
                  borderBottom={index < activities.length - 1 ? "1px solid #f0f0f0" : "none"}
                >
                  <MDBox 
                    bgcolor={activity.color} 
                    borderRadius="50%" 
                    width="2.5rem" 
                    height="2.5rem" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    mr={2}
                  >
                    <IconComponent size={16} color="white" />
                  </MDBox>
                  
                  <MDBox flex={1}>
                    <MDTypography variant="body2" fontWeight="medium">
                      {activity.description}
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      {activity.timestamp}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              );
            })}
          </MDBox>
        </CardContent>
      </Card>

      <MDBox textAlign="center" mt={3}>
        <MDTypography variant="body2" color="text">
          More activity tracking features coming soon
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ActivityFeed;