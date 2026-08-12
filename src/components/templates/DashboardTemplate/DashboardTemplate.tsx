"use client";

import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { Header } from "@/components/organisms/Header/Header";

interface DashboardTemplateProps {
  children: React.ReactNode;
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
