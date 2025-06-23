export async function deleteItem(id: number) {
	const res = await fetch('/api/item?id=' + id, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id }),
	});
    
	if (!res.ok) throw new Error('Failed to delete item');
}