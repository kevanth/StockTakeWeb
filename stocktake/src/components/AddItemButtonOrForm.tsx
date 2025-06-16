"use client";

import { useState } from "react";
import ItemForm from "./itemForm"; 
import Item from "@/class/Item";


export default function AddItemButtonOrForm() {
	const [showForm, setShowForm] = useState(false);

	if (showForm) {
		return (
			<ItemForm
				onSubmit={(item: Item) => {
					// Logic to add item
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
