"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { InventoryManager } from "@/components/InventoryManager";

export default function Inventory() {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger className="mt-6 ml-6" />
          <InventoryManager />
        </main>
      </SidebarProvider>
    </div>
  );
}
