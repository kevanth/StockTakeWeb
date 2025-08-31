"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Toaster, toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import Item from "@/class/Item";
import Box from "@/class/box";

// Generic fetcher used by SWR
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export default function Inventory() {
  const [activeBox, setActiveBox] = useState<Box | null>(null);

  // 1) Load boxes (cached, deduped, etc.)
  const {
    data: boxesResp,
    error: boxesError,
    isLoading: boxesLoading,
  } = useSWR<{ boxes: Box[] }>("/api/box", fetcher, {
    revalidateOnFocus: false,
  });

  const boxes = boxesResp?.boxes ?? [];

  // Pick the first box by default when boxes arrive
  useEffect(() => {
    if (!activeBox && boxes.length) setActiveBox(boxes[0]);
  }, [boxes, activeBox]);

  // 2) Load items whenever activeBox.id changes
  const boxId = activeBox?.id ?? null;

  const {
    data: itemsResp,
    error: itemsError,
    isLoading: itemsLoading,
    mutate: mutateItems, // call this after add/edit to refresh
  } = useSWR<{ items: Item[] }>(
    boxId ? `/api/item?boxId=${boxId}` : null, // null pauses the fetch
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000, // optional
    }
  );

  // Optional toasts
  useEffect(() => {
    if (boxesError) toast.error("Failed to load boxes");
  }, [boxesError]);
  useEffect(() => {
    if (itemsError) toast.error(itemsError.message);
  }, [itemsError]);

  const items = itemsResp?.items ?? [];

  return (
    <SidebarProvider>
      <AppSidebar
        boxes={boxes}
        activeBox={activeBox ?? undefined}
        setActiveBox={setActiveBox}
      />

      <main>
        <SidebarTrigger />

        {boxesLoading && <div className="mt-6">Loading boxes…</div>}
        {!boxesLoading && !activeBox && (
          <div className="mt-6">No boxes found.</div>
        )}

        {boxId && itemsLoading && <div className="mt-6">Loading items…</div>}

        {boxId && !itemsLoading && (
          <div>
            {items.map((item: Item) => (
              <div key={item.id}>{item.name}</div>
            ))}

            {/* If you later use AddItemButtonOrForm / ItemTile, pass mutateItems to refresh:
                <ItemTile ... refreshItems={() => mutateItems()} />
                <AddItemButtonOrForm refreshItems={() => mutateItems()} />
            */}
          </div>
        )}
      </main>

      <Toaster />
    </SidebarProvider>
  );
}
// {/* Content layout next to sidebar */} // <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"> // {/* Toggle View Button */} // <div className="flex justify-end px-4 sm:px-6"> // <button // onClick={() => setView(view === "Card" ? "List" : "Card")} // className="text-foreground" // > // {view === "Card" ? <List className="h-6 w-6" /> : <SquareStack className="h-6 w-6" />} // </button> // </div> // {/* Content */} // <main className="flex-1 p-4 sm:px-6 sm:py-0"> // {loading && <div className="text-center mt-10">Loading...</div>} // {/* Card View */} // <div // className={${ // view !== "Card" || loading ? "hidden" : "" // } grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6} // > // {items.map((item) => ( // <ItemTile // key={item.id} // item={item} // refreshItems={fetchItems} // toast={toast.error} // getCategories={fetchCategories} // /> // ))} // <AddItemButtonOrForm refreshItems={fetchItems} /> // </div> // {/* List View */} // <div // className={${ // view !== "List" || loading ? "hidden" : "" // } w-full mt-10} // > // List View Placeholder // </div> // </main> // </div> // <Toaster /> // </div> // ); }
