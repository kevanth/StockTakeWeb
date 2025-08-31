"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { InventoryManager } from "@/components/InventoryManager";
import { useBoxes } from "@/lib/hooks/useBoxes";

export default function Inventory() {
  const { boxes, activeBox, selectBox } = useBoxes();

  return (
    <SidebarProvider>
      <AppSidebar
        boxes={boxes}
        activeBox={activeBox ?? undefined}
        setActiveBox={selectBox}
      />

      <main>
        <SidebarTrigger />
        <InventoryManager />
      </main>
    </SidebarProvider>
  );
}
