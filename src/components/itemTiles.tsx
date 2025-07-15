"use client";
import { useState, useEffect, useRef } from "react";
import Item from "@/class/Item";
import { deleteItem, updateItem } from "@/lib/clientItems";
import debounce from "lodash/debounce"; // or use a custom one

interface itemTileProps {
	item: Item;
	refreshItems : () => void
	toast: (message:string) => void
	getCategories: () => Promise<string[]>;
}

export default function ItemTile({ item, refreshItems, toast, getCategories }: itemTileProps, ) {
	const [count, setCount] = useState(item.count);
	const [itemName, setItemName] = useState(item.name);
	const [category, setCategory] = useState(item.category);
	const [description, setDescription] = useState(item.description);
	const isInitialMount = useRef(true);
	const [editingCategory, setEditingCategory] = useState(false);
	const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

	const debouncedUpdate = useRef(
		debounce(async (name: string, count: number, category: string, description: string) => {
			try {
				await updateItem(new Item(item.id, name, count, category, description));
			} catch (err) {
				const message = err instanceof Error ? err.message : "Unexpected error";
				toast(message);
				refreshItems();
			}
		}, 500) // 500ms after last change
	).current;

	const categoryToggle = async () => {
		if (categoryOptions.length === 0) {
			const cats = await getCategories();
			setCategoryOptions(Array.isArray(cats) ? cats : []);

			console.log("Fetched categories:", cats);
			console.log(Array.isArray(cats) ? cats : [])
		}

		setEditingCategory(true);
	};


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
			<div className="flex flex-row w-full ">
				<div className="flex flex-row flex-1 min-w-0 items-center">
					<input
						type="text"
						value={itemName}
						size={itemName.length}
						placeholder="Name"
						maxLength={20} 
						className="max-w-full min-w-0 text-lg font-bold"
						onChange={(e) => setItemName(e.target.value)}
					/>
					{/* Categories */}
					<div className="relative flex items-center">
						<button
						className="border-2 rounded px-2 py-1 text-sm max-w-full truncate"
						onClick={()=>categoryToggle()}>
							{category||"category"}
						</button>
						{/* Drop down categories */}
						{editingCategory &&
							<div className="absolute top-full mt-1 w-64 bg-muted border rounded shadow-md z-50">
										<p className="text-sm text-muted-foreground px-3 pt-2">Select an option or create one</p>
										<ul className="px-3 pb-2 space-y-1">
											{categoryOptions.map((opt) => (
												<li
													key={opt}
													className="flex items-center justify-between text-sm px-2 py-1 rounded cursor-pointer hover:bg-accent"
													onClick={() => {
														setCategory(opt);
														setEditingCategory(false);
													}}
												>
													<span>{opt}</span>
												</li>
											))}
										</ul>
									</div>
						}
					</div>
				</div>
				<button className={buttonClass +" ml-1"} 
					onClick={() => {
					deleteItem(item.id);
					refreshItems();}}>X</button>
			</div>
			
				
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
