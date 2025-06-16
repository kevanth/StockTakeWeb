import ItemTile from "@/components/itemTiles";
import AddItemButtonOrForm from "@/components/AddItemButtonOrForm";
import Item from "@/class/Item";

export default function Inventory() {
	const initialItems = [
		new Item("Tissue", 1),
		new Item("Water", 5),
		new Item("Snacks", 2),
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-[8%] bg-background w-[80%] mx-auto mt-10">
			{initialItems.map((item, index) => (
				<ItemTile key={index} item={item} />
			))}

			<AddItemButtonOrForm/>
		</div>
	);
}
