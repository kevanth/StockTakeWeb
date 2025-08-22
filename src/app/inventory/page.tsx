"use client";

import { useEffect, useState } from "react";
import ItemTile from "@/components/itemTiles";
import AddItemButtonOrForm from "@/components/AddItemButtonOrForm";
import Item from "@/class/Item";
import { Toaster, toast } from "sonner";
import { List, SquareStack } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar";
import Box from "@/class/box";

export default function Inventory() {
	const [items, setItems] = useState<Item[]>([]);
	const [boxes, setBoxes] = useState<Box[]>([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState("Card");


	const fetchItems = async () => {
		try {
			const res = await fetch("/api/item");
			if (!res.ok) {
				const errorBody = await res.json();
				throw new Error(errorBody.error || "Request failed");
			}
			const data = await res.json();
			setItems(data.items);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unexpected error");
		} finally {
			setLoading(false);
		}
	};

	const fetchBoxes = async () => {
		const res = await fetch('/api/box', {
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		const data = await res.json()
		setBoxes(data.boxes)
	};

	useEffect(() => {
		// fetchItems();
		fetchBoxes();
	}, []);

	return (    
	<SidebarProvider>
      <AppSidebar boxes={boxes} />
      <main>
        <SidebarTrigger />
		<div>
			{boxes.map((box)=>
			(
				<div key={box.id}> {box.name} </div>
			))}
		</div>
      </main>
    </SidebarProvider>

	)
	// return (
	// 	<div className="flex min-h-screen w-full flex-col bg-muted/40">
			
	// 		{/* Content layout next to sidebar */}
	// 		<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
	// 			{/* Toggle View Button */}
	// 			<div className="flex justify-end px-4 sm:px-6">
	// 				<button
	// 					onClick={() => setView(view === "Card" ? "List" : "Card")}
	// 					className="text-foreground"
	// 				>
	// 					{view === "Card" ? <List className="h-6 w-6" /> : <SquareStack className="h-6 w-6" />}
	// 				</button>
	// 			</div>

	// 			{/* Content */}
	// 			<main className="flex-1 p-4 sm:px-6 sm:py-0">
	// 				{loading && <div className="text-center mt-10">Loading...</div>}

	// 				{/* Card View */}
	// 				<div
	// 					className={`${
	// 						view !== "Card" || loading ? "hidden" : ""
	// 					} grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6`}
	// 				>
	// 					{items.map((item) => (
	// 						<ItemTile
	// 							key={item.id}
	// 							item={item}
	// 							refreshItems={fetchItems}
	// 							toast={toast.error}
	// 							getCategories={fetchCategories}
	// 						/>
	// 					))}
	// 					<AddItemButtonOrForm refreshItems={fetchItems} />
	// 				</div>

	// 				{/* List View */}
	// 				<div
	// 					className={`${
	// 						view !== "List" || loading ? "hidden" : ""
	// 					} w-full mt-10`}
	// 				>
	// 					List View Placeholder
	// 				</div>
	// 			</main>
	// 		</div>

	// 		<Toaster />
	// 	</div>
	// );
}
