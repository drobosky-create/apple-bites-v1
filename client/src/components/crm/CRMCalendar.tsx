import React from 'react';
import { Card, CardContent } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { Calendar, Plus, Clock, Users } from 'lucide-react';

const CRMCalendar = () => {
  // Mock calendar events - in real app this would come from API
  const upcomingEvents = [
    {
      id: 1,
      title: 'Client Meeting - ABC Corp',
      date: 'Today',
      time: '3:00 PM',
      type: 'meeting',
      participants: 3
    },
    {
      id: 2,
      title: 'Follow-up Call - TechStart Inc',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'call',
      participants: 2
    },
    {
      id: 3,
      title: 'Valuation Presentation',
      date: 'Friday',
      time: '2:00 PM',
      type: 'presentation',
      participants: 5
    }
  ];

  return (
    <MDBox p={3}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Calendar
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Manage your appointments and meetings
          </MDTypography>
        </MDBox>
        <MDButton variant="gradient" color="info">
          <Plus size={16} />
          &nbsp;New Event
        </MDButton>
      </MDBox>

      <Card>
        <CardContent>
          <MDBox mb={3}>
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              Upcoming Events
            </MDTypography>
            
            {upcomingEvents.map((event) => (
              <MDBox 
                key={event.id}
                display="flex" 
                alignItems="center" 
                py={2}
                borderBottom="1px solid #f0f0f0"
              >
                <MDBox 
                  bgcolor="info.main" 
                  borderRadius="50%" 
                  width="2.5rem" 
                  height="2.5rem" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  mr={2}
                >
                  <Calendar size={16} color="white" />
                </MDBox>
                
                <MDBox flex={1}>
                  <MDTypography variant="body2" fontWeight="bold">
                    {event.title}
                  </MDTypography>
                  <MDBox display="flex" alignItems="center" gap={2} mt={0.5}>
                    <MDBox display="flex" alignItems="center">
                      <Clock size={12} style={{ marginRight: '4px', color: '#666' }} />
                      <MDTypography variant="caption" color="text">
                        {event.date} at {event.time}
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center">
                      <Users size={12} style={{ marginRight: '4px', color: '#666' }} />
                      <MDTypography variant="caption" color="text">
                        {event.participants} participants
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            ))}
          </MDBox>

          <MDBox textAlign="center" py={4} bgcolor="#f8f9fa" borderRadius="8px">
            <Calendar size={48} color="#666" style={{ marginBottom: '16px' }} />
            <MDTypography variant="h6" color="text" mb={1}>
              Full Calendar Integration
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={2}>
              Advanced calendar features with CRM integration coming soon
            </MDTypography>
            <MDButton variant="outlined" color="primary">
              Learn More
            </MDButton>
          </MDBox>
        </CardContent>
      </Card>
    </MDBox>
  );
};

export default CRMCalendar;