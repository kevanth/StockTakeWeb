"use client";
import { useState, useEffect, useRef } from "react";
import Item from "@/class/Item";
import { deleteItem, updateItem } from "@/lib/clientItems";
import debounce from "lodash/debounce"; // or use a custom one

interface itemTileProps {
	item: Item;
	refreshItems : () => void
	toast: (message:string) => void
}

export default function ItemTile({ item, refreshItems, toast }: itemTileProps, ) {
	const [count, setCount] = useState(item.count);
	const [itemName, setItemName] = useState(item.name);
	const [category, setCategory] = useState(item.category);
	const [description, setDescription] = useState(item.description);
	const isInitialMount = useRef(true);

	const debouncedUpdate = useRef(
		debounce(async (name: string, count: number, category: string, description: string) => {
			try {
				await updateItem(new Item(item.id, name, count, category, description));
			} catch (err) {
				const message = err instanceof Error ? err.message : "Unexpected error";
				console.error(message);
				toast(message);
				refreshItems();
			}
		}, 500) // 500ms after last change
	).current;

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
	if (isInitialMount.current) {
		isInitialMount.current = false;
		return;
	}
	debouncedUpdate(itemName, count, category, description);
}, [itemName, count, category, description, category]);


	const buttonClass = "border-1 border-border hover:bg-border aspect-square w-8";

	return (
		<div className="flex flex-col items-center border text-foreground border-border p-4 rounded bg-card aspect-square">
			<div className="flex flex-row w-full">
				<input
					type="text"
					value={itemName}
					className="text-lg font-bold"
					onChange={(e) => setItemName(e.target.value)}
				/>
				<button className={buttonClass} 
				onClick={() => {
				deleteItem(item.id);
				refreshItems();}}>X</button>
			</div>
			<input
				type="text"
				value={category}
				className="text-lg font-bold"
				onChange={(e) => setCategory(e.target.value)}
			/>
			<input
				type="text"
				value={description}
				className="text-lg font-bold"
				onChange={(e) => setDescription(e.target.value)}
			/>
			<input
				type="text"
				value={count}
				onChange={(e) => {
					const val = e.target.value;
					if (/^\d*$/.test(val)) {
						setCount(Number(val));
					}
				}}
				maxLength={5}
				className="border-border border-1 px-2 py-1 my-2 rounded w-auto max-w-[8ch]"
			/>
			<div className="flex gap-2 my-2">
				<button className={buttonClass} onClick={() => setCount(Math.max(0, count - 1))}>-</button>
				<button className={buttonClass} onClick={() => setCount(count + 1)}>+</button>
			</div>
		</div>
	);
}
