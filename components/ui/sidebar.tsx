import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, History, Settings } from "lucide-react";

interface SidebarProps {
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, activeTab = "dashboard", onTabChange }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={cn("flex min-h-screen w-64 flex-col border-r bg-[#01030d]", className)}>
      <div className="flex h-14 items-center border-b px-4 borber-b-black">
        <h2 className="text-lg font-semibold text-white">CodeSense</h2>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              className="w-full justify-start text-white bg-[#051956]"
              onClick={() => onTabChange?.(tab.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export { Sidebar };
