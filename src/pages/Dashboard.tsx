/**
 * Clean Dashboard - Design System Demo
 * Shows how the centralized design system works
 */

import React from 'react';
import { Button, Card, Text, Container, Stack, Grid } from '../design-system/components';
import { tokens } from '../design-system/tokens';
import { TrendingUp, Users, FileText, Settings } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <Container>
      {/* Header */}
      <Card variant="gradient" className="mb-8">
        <Stack direction="row" spacing={4}>
          <div>
            <Text variant="h3" style={{ color: 'white' }}>
              Apple Bites Dashboard
            </Text>
            <Text variant="body1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Welcome to your business valuation platform
            </Text>
          </div>
          <Button variant="secondary" style={{ marginLeft: 'auto' }}>
            Settings
          </Button>
        </Stack>
      </Card>

      {/* Stats Grid */}
      <Grid columns={4} gap={6}>
        <Card variant="elevated">
          <Stack spacing={3}>
            <TrendingUp size={32} color={tokens.colors.primary[500]} />
            <div>
              <Text variant="h4">$2.5M</Text>
              <Text variant="body2" color="secondary">Business Value</Text>
            </div>
          </Stack>
        </Card>

        <Card variant="elevated">
          <Stack spacing={3}>
            <Users size={32} color={tokens.colors.success[500]} />
            <div>
              <Text variant="h4">1,234</Text>
              <Text variant="body2" color="secondary">Active Users</Text>
            </div>
          </Stack>
        </Card>

        <Card variant="elevated">
          <Stack spacing={3}>
            <FileText size={32} color={tokens.colors.warning[500]} />
            <div>
              <Text variant="h4">45</Text>
              <Text variant="body2" color="secondary">Reports Generated</Text>
            </div>
          </Stack>
        </Card>

        <Card variant="elevated">
          <Stack spacing={3}>
            <Settings size={32} color={tokens.colors.error[500]} />
            <div>
              <Text variant="h4">98%</Text>
              <Text variant="body2" color="secondary">System Health</Text>
            </div>
          </Stack>
        </Card>
      </Grid>

      {/* Action Cards */}
      <Grid columns={2} gap={6} style={{ marginTop: tokens.spacing[8] }}>
        <Card variant="default">
          <Stack spacing={4}>
            <Text variant="h5">Start New Assessment</Text>
            <Text variant="body2" color="secondary">
              Begin a comprehensive business valuation to understand your company's worth
            </Text>
            <Button variant="primary">
              Start Assessment
            </Button>
          </Stack>
        </Card>

        <Card variant="default">
          <Stack spacing={4}>
            <Text variant="h5">View Past Reports</Text>
            <Text variant="body2" color="secondary">
              Access your historical valuation reports and track changes over time
            </Text>
            <Button variant="secondary">
              View Reports
            </Button>
          </Stack>
        </Card>
      </Grid>

      {/* Color Change Demo */}
      <Card variant="default" style={{ marginTop: tokens.spacing[8] }}>
        <Stack spacing={4}>
          <Text variant="h5">🎨 Test Global Color Changes</Text>
          <Text variant="body2" color="secondary">
            To see the power of the design system:
          </Text>
          <Text variant="body2" color="secondary">
            1. Open src/design-system/tokens.ts
          </Text>
          <Text variant="body2" color="secondary">
            2. Change line 9: primary 500 from '#4caf50' to '#e91e63' (pink)
          </Text>
          <Text variant="body2" color="secondary">
            3. Watch ALL buttons and gradient elements update instantly!
          </Text>
          <Stack direction="row" spacing={3}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="success">Success Button</Button>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};

export default Dashboard;