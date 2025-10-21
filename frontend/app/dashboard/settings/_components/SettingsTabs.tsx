"use client";

import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface SettingsTabsProps {
  defaultTab?: string;
  tabs: TabItem[];
  className?: string;
}

export function SettingsTabs({ defaultTab, tabs, className = "" }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.value || ""));

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className={`space-y-6 ${className}`}
    >
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
