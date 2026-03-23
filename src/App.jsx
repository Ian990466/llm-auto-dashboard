import { useState } from "react";
import DashboardEngine from "../dashboard-engine";

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);

  const onApplyDashboard = async (data) => {
    const slug = (data.meta?.title || "dashboard")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const id = `${slug}-${Date.now()}`;
    try {
      await fetch(`/api/dashboards/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {}
    setDashboardData(data);
  };

  return (
    <DashboardEngine
      dashboardData={dashboardData}
      onApplyDashboard={onApplyDashboard}
    />
  );
}
