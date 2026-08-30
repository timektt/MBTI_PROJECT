import { useEffect, useState } from "react";

type Settings = {
  allowRegister: boolean;
  showLeaderboard: boolean;
  maintenanceMode: boolean;
};

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({
    allowRegister: true,
    showLeaderboard: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings/get")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    const res = await fetch("/api/admin/settings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (!res.ok) {
      alert("Failed to save settings.");
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="space-y-4 max-w-xl">
      <label className="flex justify-between items-center">
        <span>Allow User Registration</span>
        <input
          type="checkbox"
          checked={settings.allowRegister}
          onChange={() => handleToggle("allowRegister")}
          aria-label="Allow User Registration"
        />
      </label>

      <label className="flex justify-between items-center">
        <span>Show Leaderboard</span>
        <input
          type="checkbox"
          checked={settings.showLeaderboard}
          onChange={() => handleToggle("showLeaderboard")}
          aria-label="Show Leaderboard"
        />
      </label>

      <label className="flex justify-between items-center">
        <span>Maintenance Mode</span>
        <input
          type="checkbox"
          checked={settings.maintenanceMode}
          onChange={() => handleToggle("maintenanceMode")}
          aria-label="Maintenance Mode"
        />
      </label>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
}
