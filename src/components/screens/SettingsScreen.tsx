"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Panel } from "@/components/holistic/shared";
import { api, post } from "@/lib/client-api";
import { useApp } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Watch, Bell, ShieldCheck, Globe, Palette, Download } from "lucide-react";

export default function SettingsScreen() {
  const setView = useApp((s) => s.setView);
  const router = useRouter();
  const [notifications, setNotifications] = useState(false);
  const [consent, setConsent] = useState<{ active: Record<string, unknown> } | null>(null);

  useEffect(() => {
    api<{ active: Record<string, unknown> }>("/api/consent").then(setConsent).catch(() => setConsent({ active: {} }));
  }, []);

  async function logout() {
    await post("/api/auth/logout");
    toast({ title: "Logged out" });
    router.refresh();
    window.location.reload();
  }

  function exportData() {
    // Client-side export of the user's own data (privacy: data portability).
    Promise.all([
      api("/api/prakriti"),
      api("/api/vikriti"),
      api("/api/history"),
      api("/api/readings?days=90"),
    ]).then(([prakriti, vikriti, history, readings]) => {
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), prakriti, vikriti, history, readings }, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `holistic-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Data exported", description: "A JSON copy of your data was downloaded." });
    });
  }

  return (
    <div className="animate-fade-up mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Panel className="p-0">
        <button type="button" onClick={() => setView("wearables")} className="flex w-full items-center justify-between border-b px-6 py-4 text-left transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <Watch className="h-4.5 w-4.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Connected devices</p>
              <p className="text-xs text-muted-foreground">Manage your smartwatch connection</p>
            </div>
          </div>
          <span className="text-sm capitalize text-muted-foreground">{consent?.active?.["wearable_sync"] ? "Connected" : "Not connected"}</span>
        </button>

        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Reminders</p>
              <p className="text-xs text-muted-foreground">Assessment and routine nudges (prototype stores the preference only)</p>
            </div>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Toggle reminders" />
        </div>

        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Privacy</p>
              <p className="text-xs text-muted-foreground">Your data is user-isolated; export or review consent records</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export my data
          </Button>
        </div>

        <div className="flex items-center justify-between border-b px-6 py-4 opacity-60">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-xs text-muted-foreground">English (more languages planned)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Appearance</p>
              <p className="text-xs text-muted-foreground">Calm light theme; dark palette ships with the theme variables</p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="flex justify-end">
        <Button variant="destructive" onClick={logout}>Log out</Button>
      </div>
    </div>
  );
}
