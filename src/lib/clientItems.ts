import Item from "@/class/Item";

export async function deleteItem(id: number) {
	const res = await fetch('/api/item/' + id, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id }),
	});
    
	if (!res.ok) throw new Error('Failed to delete item');
}

export async function updateItem(item: Item) {

	console.log("API CALL: " + item.category)
	console.log("API CALL: " )
	const res = await fetch(`/api/item/${item.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
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
