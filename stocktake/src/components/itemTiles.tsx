"use client";
import { useState, useEffect, useRef } from "react";
import Item from "@/class/Item";
import { deleteItem, updateItem } from "@/lib/clientItems";
import debounce from "lodash/debounce"; // or use a custom one

interface itemTileProps {
	item: Item;
}

export default function ItemTile({ item }: itemTileProps) {
	const [count, setCount] = useState(item.count);
	const [itemName, setItemName] = useState(item.name);
	const isInitialMount = useRef(true);

	const debouncedUpdate = useRef(
		debounce(async (name: string, count: number) => {
			try {
				await updateItem(new Item(item.id, name, count));
			} catch (err) {
				console.error("Update failed", err);
			}
		}, 500) // 500ms after last change
	).current;

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
	if (isInitialMount.current) {
		isInitialMount.current = false;
		return;
	}
	debouncedUpdate(itemName, count);
}, [itemName, count]);


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
				<button className={buttonClass} onClick={() => deleteItem(item.id)}>X</button>
			</div>
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
