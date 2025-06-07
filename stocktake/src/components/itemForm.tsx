"use client";
import { useState } from "react";
import Item from "@/class/Item";

export default function ItemForm() {
  const [itemName,setItemName] = useState("")
  const [quantity,setQuantity] = useState(0)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // prevent page reload
        console.log('Item Name:', itemName);
        console.log('Quantity:', quantity);

        // Add your submission logic here
        alert(`Submitted: ${itemName} x${quantity}`);
    };
  
  return (
    <div className="flex flex-col items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square">
		<form onSubmit={handleSubmit} className="flex flex-col w-fit">
			<input
				type="text"
				placeholder="Item Name"
				className="border-border border-1 px-2 py-1 my-2 rounded w-auto"
				value={itemName}
				onChange={(e) => setItemName(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Quantity"
				className="border-border border-1 px-2 py-1 my-2 rounded w-auto"
				value={quantity}
				onChange={(e) => {
					const val = e.target.value;
					if (/^\d*$/.test(val)) {
						setQuantity(val);
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
					setQuantity('');
				}}
				className="border px-4 py-2 my-2 rounded bg-red-500 text-white hover:bg-red-600"
			>
				❌ Reset
			</button>
		</form>
    </div>
    
  );
}
