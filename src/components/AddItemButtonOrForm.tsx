"use client";
import { useState } from "react";
import ItemForm from "./itemForm"; 
import Item from "@/class/Item";

export default function AddItemButtonOrForm({ refreshItems }: { refreshItems: () => void }) {
	const [showForm, setShowForm] = useState(false);

	if (showForm) {
		return (
			<ItemForm
				onSubmit={async (item: Item) => {
					await fetch("/api/item", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							name: item.name,
							count: item.count,
						}),
					});
					refreshItems(); //refresh from parent
					setShowForm(false);
				}}
			/>
		);
	}

	return (
		<button
			onClick={() => setShowForm(true)}
			className="text-7xl flex justify-center items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square hover:bg-tertiary hover:font-bold"
		>
			+
		</button>
	);
}
