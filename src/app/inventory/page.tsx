"use client";

import { useEffect, useState } from "react";
import ItemTile from "@/components/itemTiles";
import AddItemButtonOrForm from "@/components/AddItemButtonOrForm";
import Item from "@/class/Item";
import { Toaster, toast } from "sonner";
import NavBar from "@/components/NavBar";
import { List, SquareStack } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export default function Inventory() {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState("Card");
	const fetchItems = async () => {
		try {
			const res = await fetch("/api/item");
			if (!res.ok) {
				const errorBody = await res.json();
				console.error("API error:", errorBody.error);
				throw new Error(errorBody.error || "Request failed");
			}
			const data = await res.json();
			setItems(data.items);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unexpected error";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const res = await fetch("/api/category");
			if (!res.ok) {
				const errorBody = await res.json();
				console.error("API error:", errorBody.error);
				throw new Error(errorBody.error || "Request failed");
			}
			const data = await res.json();
			return data.categories;
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unexpected error";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<div>
			<NavBar />
			{/* <SidebarProvider>
				<AppSidebar>
				</AppSidebar>
			</SidebarProvider> */}
			<Toaster />
			<div className="flex justify-end p-2 w-[80%] mx-auto">
				<button
					onClick={() => setView(view === "Card" ? "List" : "Card")}
					className="text-foreground"
				>
					{view === "Card" && <List className="h-6 w-6" />}
					{view === "List" && <SquareStack className="h-6 w-6" />}
				</button>
			</div>
			{loading && (
				<div className="w-full text-center mt-10">Loading...</div>
			)}
			{/* Card View */}
			<div
				className={`${
					view !== "Card" || loading ? "hidden" : ""
				} grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 bg-background w-full max-w-screen-xl mx-auto mt-10 px-4`}
			>
				{items.map((item) => (
					<ItemTile
						key={item.id}
						item={item}
						refreshItems={fetchItems}
						toast={toast.error}
						getCategories={fetchCategories}
					/>
				))}
				<AddItemButtonOrForm refreshItems={fetchItems}/>
			</div>
			{/* List View */}
			<div
				className={`${
					view !== "List" || loading ? "hidden" : ""
				} w-[80%] mx-auto mt-10`}
			>
				List View Placeholder
			</div>
		</div>
	);
}
