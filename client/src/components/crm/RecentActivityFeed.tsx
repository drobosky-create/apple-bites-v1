import React from 'react';
import { Card, CardContent } from '@mui/material';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import { Activity, TrendingUp, Phone, Mail, Award } from 'lucide-react';

const RecentActivityFeed = () => {
  const recentActivities = [
    { type: 'deal_update', title: 'TechCorp acquisition moved to Due Diligence', time: '2 hours ago', icon: TrendingUp },
    { type: 'meeting', title: 'Call scheduled with RetailPlus CFO', time: '4 hours ago', icon: Phone },
    { type: 'email', title: 'Proposal sent to Manufacturing Inc.', time: '6 hours ago', icon: Mail },
    { type: 'win', title: 'HealthTech deal closed - $2.5M', time: '1 day ago', icon: Award },
  ];

  return (
    <Card sx={{ height: '400px' }}>
      <CardContent>
        <MDBox display="flex" alignItems="center" mb={2}>
          <Activity size={20} color="#059669" />
          <MDTypography variant="h6" fontWeight="bold" color="dark" ml={1}>
            Recent Activity
          </MDTypography>
        </MDBox>
        
        <MDBox sx={{ maxHeight: '320px', overflowY: 'auto' }}>
          {recentActivities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <MDBox key={index} display="flex" alignItems="flex-start" mb={2}>
                <MDBox 
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    flexShrink: 0
                  }}
                >
                  <IconComponent size={16} color="#6B7280" />
                </MDBox>
                <MDBox>
                  <MDTypography variant="body2" fontWeight="medium" color="dark">
                    {activity.title}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    {activity.time}
                  </MDTypography>
                </MDBox>
              </MDBox>
            );
          })}
        </MDBox>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;