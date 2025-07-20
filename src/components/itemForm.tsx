"use client";
import { useState } from "react";
import Item from "@/class/Item";


export default function ItemForm({onSubmit}: {onSubmit: (item : Item) => void}) {
  const [itemName,setItemName] = useState("")
  const [quantity,setQuantity] = useState(0)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        const newItem = new Item(0, itemName, quantity, "", "");
        onSubmit(newItem);
        setItemName('');
        setQuantity(0);
    };
  
  return (
    <div className="flex flex-col items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square">
		<form onSubmit={handleSubmit} className="flex flex-col w-fit">
            {/* Item Name input */}
			<input
				type="text"
				placeholder="Item Name"
				className="border-border border-1 px-2 py-1 my-2 rounded w-auto"
				value={itemName}
				onChange={(e) => setItemName(e.target.value)}
			/>
            {/* Item Quantity input */}
			<input
				type="text"
				placeholder="Quantity"
				className="border-border border-1 px-2 py-1 my-2 rounded w-auto"
				value={quantity}
				onChange={(e) => {
					const val = e.target.value;
					if (/^\d*$/.test(val)) {
						setQuantity(Number(val));
					}
				}}
			/>

			<button
				type="submit"
				className="border px-4 py-2 my-2 rounded bg-green-500 text-white hover:bg-green-600"
			>
				✅ Submit
			</button>

			<button
				type="button"
				onClick={() => {
					setItemName('');
					setQuantity(0);
				}}
				className="border px-4 py-2 my-2 rounded bg-red-500 text-white hover:bg-red-600"
			>
				❌ Reset
			</button>
		</form>
    </div>
    
  );
}
