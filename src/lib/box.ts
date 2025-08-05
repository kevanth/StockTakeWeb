
import { supabase } from "./db";

export async function getBoxes(username: string): Promise<string[]> {
	const { data, error } = await supabase
		.from("boxes")
		.select("*")
		.eq("owner_id", username);

	if (error) {
		console.error("Fetch failed:", error.message, error.details);
		throw new Error("Fetch failed: " + error.message);
	}
;
}

export async function getCategories(username: string): Promise<string[]> {
		const { data, error } = await supabase
		.from("boxes")
		.select("category")
		.eq("owner", username)

	if (error) {
		console.error("Fetch failed:", error.message, error.details);
		throw new Error("Fetch failed: " + error.message);
	}
	
	const uniqueCategories = [...new Set((data ?? []).filter(row => row.category != null).map(row => row.category))];

	return uniqueCategories;
}

export async function addItem(username: string, item: Item): Promise<void> {
	const { error } = await supabase.from("boxes").insert({
		owner: username,
		name: item.name,
		quantity: item.count,
		last_updated: new Date().toISOString(),
	});

	if (error) {
		console.error("Insert failed:", error.message, error.details);
		throw new Error("Insert failed: " + error.message);
	}
}

export async function updateItem(username: string, item: Item): Promise<void> {
	const { error } = await supabase
		.from("boxes")
		.update({
			name: item.name,
			quantity: item.count,
			category: item.category,
			description: item.description,
			last_updated: new Date().toISOString(),
		})
		.eq("id", item.id)
		.eq("owner", username); // Optional: enforce ownership
	
	if (error) {
		console.error("Update failed:", error.message, error.details);
		throw new Error("Update failed: " + error.message);
	}
}

export async function deleteItem(id: number): Promise<void> {
	const { error } = await supabase
		.from("boxes")
		.delete()
		.eq("id", id);

	if (error) {
		console.error("Delete failed:", error.message, error.details);
		throw new Error("Delete failed: " + error.message);
	}
}

