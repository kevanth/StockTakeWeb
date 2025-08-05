"use client";
import { useRef, useState } from "react";
import ItemForm from "./itemForm"; 
import Item from "@/class/Item";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { supabase } from "@/lib/db";

export default function AddItemButtonOrForm({ refreshItems }: { refreshItems: () => void }) {
	const [showForm, setShowForm] = useState(false);
	const clickOutside = useRef<HTMLDivElement|null>(null)

	useClickOutside(clickOutside,()=>setShowForm(false))

	return(
			<div ref={clickOutside}>
				{showForm &&
				<ItemForm
					onSubmit={async (item: Item) => {
						const { data: { session } } = await supabase.auth.getSession();
						const headers = {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${session?.access_token}`
						};

						await fetch("/api/item", {
							method: "POST",
							headers,
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
