import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CRMOverview from "@/components/crm/CRMOverview";
import ContactManagement from "@/components/crm/ContactManagement";
import FirmManagement from "@/components/crm/FirmManagement";
import DealPipeline from "@/components/crm/DealPipeline";
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
  Mail
} from 'lucide-react';

const CRMDashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: 'New' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'firms', label: 'Firms', icon: Building2 },
    { id: 'distributions', label: 'Distributions', icon: Send },
    { id: 'sequences', label: 'Sequences', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <CRMOverview />;
      case 'dashboard':
        return <DealPipeline />;
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
      setActiveSection={setActiveSection}
      title="Apple Bites CRM"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default CRMDashboard;