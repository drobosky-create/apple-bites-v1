// client/src/pages/workspace/WorkspaceLayoutTest.tsx
import React from "react";
import MaterialDashboardLayout from "@/layouts/TeamTrack/MaterialDashboardLayout";

export default function WorkspaceLayoutTest() {
  return (
    <MaterialDashboardLayout>
      <div style={{ padding: 20 }}>
        <h1>Inside TeamTrack Shell ✅</h1>
        <p>Testing if the MaterialDashboardLayout with sidebar is rendering correctly.</p>
        <p>You should see:</p>
        <ul>
          <li>✅ Green sidebar on the left with TeamTrack navigation</li>
          <li>✅ Top bar with "Welcome back, admin"</li>
          <li>✅ This content area with white background</li>
        </ul>
      </div>
    </MaterialDashboardLayout>
  );
}