import Item from "@/class/Item";
import { supabase } from "./db";

export async function getItems(boxId?: string): Promise<Item[]> {
	let query = supabase
		.from("items")
		.select("*")
		.order("created_at", { ascending: false });

	// If boxId is provided, filter by box
	if (boxId) {
		query = query.eq("box_id", boxId);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Fetch items failed:", error.message, error.details);
		throw new Error("Fetch items failed: " + error.message);
	}

	return data?.map(row => new Item(
		row.id, 
		row.name, 
		row.quantity || 0, 
		row.category || "", 
		row.description || ""
	)) || [];
}

export async function getCategories(boxId?: string): Promise<string[]> {
	let query = supabase
		.from("items")
		.select("category");

	// If boxId is provided, filter by box
	if (boxId) {
		query = query.eq("box_id", boxId);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Fetch categories failed:", error.message, error.details);
		throw new Error("Fetch categories failed: " + error.message);
	}
	
	const uniqueCategories = [...new Set((data ?? []).filter(row => row.category != null).map(row => row.category))];

	return uniqueCategories;
}

export async function addItem(item: Item, boxId: string): Promise<void> {
	const { error } = await supabase.from("items").insert({
		name: item.name,
		quantity: item.count,
		box_id: boxId,
		category: item.category,
		description: item.description
	});

	if (error) {
		console.error("Insert item failed:", error.message, error.details);
		throw new Error("Insert item failed: " + error.message);
	}
}

export async function updateItem(item: Item): Promise<void> {
	const { error } = await supabase
		.from("items")
		.update({
			name: item.name,
			quantity: item.count,
			category: item.category,
			description: item.description
		})
		.eq("id", item.id);
	
	if (error) {
		console.error("Update item failed:", error.message, error.details);
		throw new Error("Update item failed: " + error.message);
	}
}

export async function deleteItem(id: string): Promise<void> {
	const { error } = await supabase
		.from("items")
		.delete()
		.eq("id", id);

	if (error) {
		console.error("Delete item failed:", error.message, error.details);
		throw new Error("Delete item failed: " + error.message);
	}
}

