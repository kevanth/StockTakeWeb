"use client";

import { useEffect, useState } from "react";
import ItemTile from "@/components/itemTiles";
import AddItemButtonOrForm from "@/components/AddItemButtonOrForm";
import Item from "@/class/Item";
import { Toaster, toast } from "sonner";

export default function Inventory() {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchItems = async () => {
		try {
			const res = await fetch("/api/item")
			if (!res.ok){
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
		<div className="grid grid-cols-1 md:grid-cols-4 gap-[8%] bg-background w-[80%] mx-auto mt-10">
			<Toaster richColors position="top-right" />
			{loading ? (
				<div className="col-span-full text-center">Loading...</div>
			) : (
				<>
					{items.map((item, index) => (
						<ItemTile key={index} item={item} />
					))}
					<AddItemButtonOrForm refreshItems={fetchItems} />
				</>
			)}
		</div>
	);
}
