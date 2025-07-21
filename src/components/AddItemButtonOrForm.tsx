"use client";
import { ReactElement, useRef, useState } from "react";
import ItemForm from "./itemForm"; 
import Item from "@/class/Item";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export default function AddItemButtonOrForm({ refreshItems }: { refreshItems: () => void }) {
	const [showForm, setShowForm] = useState(false);
	const clickOutside = useRef<HTMLDivElement|null>(null)

	useClickOutside(clickOutside,()=>setShowForm(false))

	return(
			<div ref={clickOutside}>
				{showForm &&
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
				/>}
				{!showForm &&
					<button
					onClick={() => setShowForm(true)}
					className="w-full h-full text-7xl flex justify-center items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square hover:bg-tertiary hover:font-bold"
						>
						+
					</button>
				}	
			</div>
			
		)
}
