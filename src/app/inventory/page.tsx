"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { InventoryManager } from "@/components/InventoryManager";

export default function Inventory() {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col items-center">
          <SidebarTrigger className="mt-6 ml-6 self-start" />
          <div className="w-full max-w-6xl mx-auto px-6 py-4">
            <InventoryManager />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
