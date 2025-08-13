import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CRMOverview from "@/components/crm/CRMOverview";
import ContactManagement from "@/components/crm/ContactManagement";
import FirmManagement from "@/components/crm/FirmManagement";
import DealPipeline from "@/components/crm/DealPipeline";
import ExecutiveDashboard from "@/components/crm/ExecutiveDashboard";
import EnhancedDealPipeline from "@/components/crm/EnhancedDealPipeline";
import AnalyticsInsights from "@/components/crm/AnalyticsInsights";
import ActivityFeed from "@/components/crm/ActivityFeed";
import CRMCalendar from "@/components/crm/CRMCalendar";
import CRMTasks from "@/components/crm/CRMTasks";
import CRMReports from "@/components/crm/CRMReports";
import CRMDistributions from "@/components/crm/CRMDistributions";
import CRMSequences from "@/components/crm/CRMSequences";
import { 
  User, 
  BarChart3, 
  Activity, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Users, 
  Building2, 
  Send, 
  Mail,
  Target,
  TrendingUp
} from 'lucide-react';

const CRMDashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('executive');

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Access denied. Please log in.</div>;
  }

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'executive', label: 'Executive', icon: BarChart3 },
    { id: 'pipeline', label: 'Deal Pipeline', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: 'New' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'firms', label: 'Firms', icon: Building2 },
    { id: 'distributions', label: 'Distributions', icon: Send },
    { id: 'sequences', label: 'Sequences', icon: Mail },
  ];

  const handleSectionChange = (section: string) => {
    if (section === 'profile') {
      // Set a flag to indicate we came from CRM
      localStorage.setItem('crmNavigation', 'true');
      // Navigate to the user's profile page
      setLocation('/profile');
      return;
    }
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'executive':
        return <ExecutiveDashboard />;
      case 'pipeline':
        return <EnhancedDealPipeline />;
      case 'analytics':
        return <AnalyticsInsights />;
      case 'activity':
        return <ActivityFeed />;
      case 'calendar':
        return <CRMCalendar />;
      case 'tasks':
        return <CRMTasks />;
      case 'reports':
        return <CRMReports />;
      case 'contacts':
        return <ContactManagement />;
      case 'firms':
        return <FirmManagement />;
      case 'distributions':
        return <CRMDistributions />;
      case 'sequences':
        return <CRMSequences />;
      default:
        return <CRMOverview />;
    }
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems}
      activeSection={activeSection}
      setActiveSection={handleSectionChange}
      title="Apple Bites CRM"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default CRMDashboard;