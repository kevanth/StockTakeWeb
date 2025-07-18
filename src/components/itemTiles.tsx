"use client";
import { useState, useEffect, useRef } from "react";
import Item from "@/class/Item";
import { deleteItem, updateItem } from "@/lib/clientItems";
import debounce from "lodash/debounce"; 
import { useClickOutside } from "@/lib/hooks/useClickOutside";


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
	const [newCategory, setNewCategory] = useState("");
	const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
	const dropdownRef = useRef<HTMLDivElement | null>(null);


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


	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		debouncedUpdate(itemName, count, category, description);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemName, count, category, description, category]);

	useClickOutside(dropdownRef, () => {
		setEditingCategory(false);
	});	


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
						className={"border-2 rounded px-2 py-1 text-sm max-w-full truncate" + ((!category)?" text-accent":"")}
						onClick={()=>categoryToggle()}>
							{category||"select category"}
						</button>
						{/* Drop down categories */}
						{editingCategory && (
							<div ref={dropdownRef} className="absolute mt-1 w-64 bg-white border rounded shadow-md z-50">
								<input
									autoFocus
									value={newCategory}
									onChange={(e) => setNewCategory(e.target.value)}
									className="w-full px-3 py-2 border-b text-sm outline-none"
									placeholder="Select or create a category"
								/>
								<ul className="max-h-40 overflow-y-auto">
									{categoryOptions
										.filter(opt => opt.toLowerCase().includes(newCategory.toLowerCase()))
										.map((opt) => (
											<li
												key={opt}
												className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
												onClick={() => {
													setCategory(opt);
													setEditingCategory(false);
												}}
											>
												{opt}
											</li>
									))}

									{/* If no match, offer to create */}
									{!categoryOptions.includes(newCategory) && newCategory.trim() !== "" && (
										<li
											className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium text-blue-600"
											onClick={() => {
												setCategory(newCategory.trim());
												setEditingCategory(false);
											}}
										>
											+ Create “{newCategory.trim()}”
										</li>
									)}
								</ul>
							</div>
						)}

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
