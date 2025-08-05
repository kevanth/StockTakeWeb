import Item from "@/class/Item";
import { supabase } from "./db";

async function getAuthHeaders() {
	const { data: { session } } = await supabase.auth.getSession();
	return {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${session?.access_token}`
	};
}

export async function deleteItem(id: string) {
	const headers = await getAuthHeaders();
	const res = await fetch('/api/item/' + id, {
		method: 'DELETE',
		headers,
	});
    
	if (!res.ok) throw new Error('Failed to delete item');
}

export async function updateItem(item: Item) {
	const headers = await getAuthHeaders();
	console.log("API CALL: " + item.category)
	console.log("API CALL: " )
	const res = await fetch(`/api/item/${item.id}`, {
		method: "PUT",
		headers,
		body: JSON.stringify({
			name: item.name,
			count: item.count,
			description: item.description,
			category: item.category
		})
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error("Failed to update item: " + err.error);
	}
}
