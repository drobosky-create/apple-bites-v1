import React from "react";
import TeamTrackSidebar from "@/components/workspace/TeamTrackSidebar";

interface MaterialDashboardLayoutProps {
  children: React.ReactNode;
}

export default function MaterialDashboardLayout({ children }: MaterialDashboardLayoutProps) {
  console.log('MOUNT: TeamTrack MaterialDashboardLayout');
  
  return (
    // 15rem fixed left column + flexible right column (minmax prevents overflow)
    <div className="min-h-screen grid grid-cols-[15rem_minmax(0,1fr)]">
      {/* keep the sidebar visible & on top if content goes absolute */}
      <aside className="sticky top-0 h-screen z-10">
        <TeamTrackSidebar />
      </aside>

      {/* main column must not overflow the grid cell */}
      <div className="min-w-0 flex flex-col">
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}