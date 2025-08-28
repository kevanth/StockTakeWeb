import Item from "@/class/Item"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Get all items for a given user
export async function getItems(supabase: SupabaseClient<Database>, boxId: string): Promise<Item[]> {
	const { data, error } = await supabase
		.from("items")
		.select("*")
		.eq("box_id", boxId)

	if (error) {
		console.error("Fetch failed:", error.message, error.details)
		throw new Error("Fetch failed: " + error.message)
	}

	return data?.map(
		(row) => new Item(row.id, row.name)
	) || []
}

// Get all boxes for the currently logged in user
export async function getBoxes(supabase: SupabaseClient<Database>): Promise<string[]> {
	
	const { data, error } = await supabase
		.from("box_members")
		.select("box_id")

	if (error) {
		console.error("Failed to fetch boxes", error)
		throw new Error("Could not load boxes")
	}

	return data.map((b) => b.box_id)
}

// // Insert a new item
// export async function addItem(
// 	supabase: SupabaseClient<Database>,
// 	username: string,
// 	item: Item
// ): Promise<void> {
// 	const { error } = await supabase.from("items").insert({
// 		owner: username,
// 		name: item.name,
// 		quantity: item.count,
// 		category: item.category,
// 		description: item.description,
// 		last_updated: new Date().toISOString(),
// 	})

// 	if (error) {
// 		console.error("Insert failed:", error.message, error.details)
// 		throw new Error("Insert failed: " + error.message)
// 	}
// }

// // Update an existing item
// export async function updateItem(
// 	supabase: SupabaseClient<Database>,
// 	username: string,
// 	item: Item
// ): Promise<void> {
// 	const { error } = await supabase
// 		.from("items")
// 		.update({
// 			name: item.name,
// 			quantity: item.count,
// 			category: item.category,
// 			description: item.description,
// 			last_updated: new Date().toISOString(),
// 		})
// 		.eq("id", item.id)
// 		.eq("owner", username)

// 	if (error) {
// 		console.error("Update failed:", error.message, error.details)
// 		throw new Error("Update failed: " + error.message)
// 	}
// }

// // Delete an item by ID
// export async function deleteItem(
// 	supabase: SupabaseClient<Database>,
// 	id: number
// ): Promise<void> {
// 	const { error } = await supabase
// 		.from("items")
// 		.delete()
// 		.eq("id", id)

// 	if (error) {
// 		console.error("Delete failed:", error.message, error.details)
// 		throw new Error("Delete failed: " + error.message)
// 	}
// }
