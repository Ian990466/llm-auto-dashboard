import { useState, useEffect } from "react";
import DashboardEngine from "../dashboard-engine";

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);

  // Load the most recently modified dashboard on startup, then watch for changes
  useEffect(() => {
    fetch("/api/dashboards")
      .then((r) => r.json())
      .then((list) => {
        if (!list.length) return;
        const latest = list.sort((a, b) =>
          (b.generated_at || "").localeCompare(a.generated_at || ""),
        )[0];
        return fetch(`/api/dashboards/${latest.id}`)
          .then((r) => r.json())
          .then(setDashboardData);
      })
      .catch(() => {});

    const es = new EventSource("/api/dashboards/events");
    es.onmessage = (e) => {
      try {
        const { data } = JSON.parse(e.data);
        setDashboardData(data);
      } catch {}
    };
    return () => es.close();
  }, []);

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
