import ItemTile from "../components/itemTiles";
import Item from "@/class/Item";

export default function Home() {
  const itemArr: Item[] = [
    { name: "Tissue", initialCount: 1 },
    { name: "Water", initialCount: 5 },
    { name: "Snacks", initialCount: 2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[10%] bg-background w-[80%] mx-auto mt-10" >
      {itemArr.map((item, index) => (
        <ItemTile
          key={index}
          name={item.name}
          initialCount={item.initialCount}
        />
      ))}

      <ItemTile name="tissue" initialCount={1}></ItemTile>
    </div>
  );
}
