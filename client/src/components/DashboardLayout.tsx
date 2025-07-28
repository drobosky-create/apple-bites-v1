import { Box, styled } from '@mui/material';
import DashboardSidebar from './DashboardSidebar';

const DashboardBackground = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundAttachment: 'fixed',
  display: 'flex',
});

const MainContent = styled(Box)({
  flexGrow: 1,
  marginLeft: '328px', // 280px sidebar + 48px margin
  padding: '24px 24px 24px 0',
  minHeight: '100vh',
});

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: 'dashboard' | 'past-assessments' | 'value-calculator' | 'assessment-results' | 'profile';
}

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  return (
    <DashboardBackground>
      <DashboardSidebar currentPage={currentPage} />
      <MainContent>
        {children}
      </MainContent>
    </DashboardBackground>
  );
}