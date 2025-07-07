"use client";

import { useEffect, useState } from "react";
import ItemTile from "@/components/itemTiles";
import AddItemButtonOrForm from "@/components/AddItemButtonOrForm";
import Item from "@/class/Item";
import { Toaster, toast } from "sonner";
import NavBar from "@/components/NavBar";
import { List, SquareStack } from "lucide-react";

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

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<div>
			<Toaster />
			<NavBar />
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
				} grid grid-cols-1 md:grid-cols-4 gap-[8%] bg-background w-[80%] mx-auto mt-10`}
			>
				{items.map((item) => (
					<ItemTile
						key={item.id}
						item={item}
						refreshItems={fetchItems}
						toast={toast.error}
					/>
				))}
				<AddItemButtonOrForm refreshItems={fetchItems} />
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
