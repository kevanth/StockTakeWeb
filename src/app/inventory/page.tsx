"use client";

import { useEffect, useState } from "react";
import ItemTile from "@/components/itemTiles";
import AddItemButtonOrForm from "@/components/AddItemButtonOrForm";
import Item from "@/class/Item";

export default function Inventory() {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchItems = async () => {
		try {
			const res = await fetch("/api/item?username=test");
			const data = await res.json();
			setItems(data.items);
		} catch (error) {
			console.error("Failed to fetch items:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-[8%] bg-background w-[80%] mx-auto mt-10">
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
