"use client";

import { useState } from "react";
import { useApp, greeting, type View } from "@/lib/store";
import { clearToken } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LeafMark } from "@/components/screens/AuthScreen";
import DashboardScreen from "@/components/screens/DashboardScreen";
import PrakritiAssessmentScreen from "@/components/screens/PrakritiAssessmentScreen";
import PrakritiResultScreen from "@/components/screens/PrakritiResultScreen";
import VikritiAssessmentScreen from "@/components/screens/VikritiAssessmentScreen";
import VikritiResultScreen from "@/components/screens/VikritiResultScreen";
import WearablesScreen from "@/components/screens/WearablesScreen";
import ManualEntryScreen from "@/components/screens/ManualEntryScreen";
import EnvironmentScreen from "@/components/screens/EnvironmentScreen";
import RecommendationsScreen from "@/components/screens/RecommendationsScreen";
import HistoryScreen from "@/components/screens/HistoryScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import SettingsScreen from "@/components/screens/SettingsScreen";
import AboutScreen from "@/components/screens/AboutScreen";
import {
  Home,
  ClipboardList,
  Activity,
  Watch,
  PenLine,
  CloudSun,
  Sparkles,
  History as HistoryIcon,
  User,
  Settings as SettingsIcon,
  BookOpen,
  Menu,
  LogOut,
} from "lucide-react";

const NAV: { id: View; label: string; icon: React.ComponentType<{ className?: string }>; group: "main" | "secondary" }[] = [
  { id: "dashboard", label: "Home", icon: Home, group: "main" },
  { id: "prakriti-result", label: "Prakriti", icon: ClipboardList, group: "main" },
  { id: "vikriti-result", label: "Vikriti", icon: Activity, group: "main" },
  { id: "recommendations", label: "Recommendations", icon: Sparkles, group: "main" },
  { id: "wearables", label: "Health Data", icon: Watch, group: "main" },
  { id: "manual-entry", label: "Manual Entry", icon: PenLine, group: "main" },
  { id: "environment", label: "Environment", icon: CloudSun, group: "main" },
  { id: "history", label: "History", icon: HistoryIcon, group: "main" },
  { id: "profile", label: "Profile", icon: User, group: "secondary" },
  { id: "settings", label: "Settings", icon: SettingsIcon, group: "secondary" },
  { id: "about", label: "About & References", icon: BookOpen, group: "secondary" },
];

const TITLES: Partial<Record<View, string>> = {
  dashboard: "Home",
  "prakriti-assessment": "Prakriti Assessment",
  "prakriti-result": "Prakriti",
  "vikriti-assessment": "Vikriti Check-in",
  "vikriti-result": "Vikriti",
  wearables: "Health Data",
  "manual-entry": "Manual Entry",
  environment: "Environment",
  recommendations: "Recommendations",
  history: "History",
  profile: "Profile",
  settings: "Settings",
  about: "About & References",
};

export default function AppShell() {
  const { view, setView, user } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const screen = (() => {
    switch (view) {
      case "dashboard":
        return <DashboardScreen />;
      case "prakriti-assessment":
        return <PrakritiAssessmentScreen />;
      case "prakriti-result":
        return <PrakritiResultScreen />;
      case "vikriti-assessment":
        return <VikritiAssessmentScreen />;
      case "vikriti-result":
        return <VikritiResultScreen />;
      case "wearables":
        return <WearablesScreen />;
      case "manual-entry":
        return <ManualEntryScreen />;
      case "environment":
        return <EnvironmentScreen />;
      case "recommendations":
        return <RecommendationsScreen />;
      case "history":
        return <HistoryScreen />;
      case "profile":
        return <ProfileScreen />;
      case "settings":
        return <SettingsScreen />;
      case "about":
        return <AboutScreen />;
      default:
        return <DashboardScreen />;
    }
  })();

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // Server unreachable — still drop the local session below.
    }
    // The bearer token in localStorage would otherwise sign the user right
    // back in after the reload, even though the cookie was just destroyed.
    clearToken();
    window.location.reload();
  }

  const navList = (onClickItem?: () => void) => (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
      {NAV.map((item) => {
        const active = view === item.id || (item.id === "prakriti-result" && view === "prakriti-assessment") || (item.id === "vikriti-result" && view === "vikriti-assessment");
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setView(item.id);
              onClickItem?.();
            }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-[18px] w-[18px]", active ? "text-primary" : "")} />
            {item.label}
          </button>
        );
      })}
      <div className="mt-auto space-y-1 border-t pt-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar px-4 py-5 lg:flex">
        <button type="button" onClick={() => setView("dashboard")} className="mb-7 flex items-center gap-2.5 px-2 text-left">
          <LeafMark className="h-7 w-7 text-primary" />
          <div>
            <span className="block text-[17px] font-semibold leading-tight tracking-tight">Holistic</span>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Ayurvedic wellness</span>
          </div>
        </button>
        {navList()}
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen w-full min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile nav */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 px-4 py-5">
                  <SheetTitle className="mb-6 flex items-center gap-2.5 px-2 text-left">
                    <LeafMark className="h-6 w-6 text-primary" />
                    <span className="font-semibold tracking-tight">Holistic</span>
                  </SheetTitle>
                  {navList(() => setMobileOpen(false))}
                </SheetContent>
              </Sheet>
              <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">{TITLES[view] ?? ""}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:block">{greeting()}</span>
              <button
                type="button"
                onClick={() => setView("profile")}
                aria-label="Open profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              >
                {(user?.name ?? "U").charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{screen}</main>
      </div>
    </div>
  );
}
