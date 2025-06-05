"use client";
import { useEffect, useState } from "react";
import ItemTile from "../components/itemTiles";
import Item from "@/class/Item";

export default function Home() {
  const [itemArr, setItemsArr] = useState<Item[]>([]);
  const [addItemPopup, setAddItemPopup] = useState(false);

  useEffect(() => {
    setItemsArr([
			{ name: "Tissue", initialCount: 1 },
			{ name: "Water", initialCount: 5 },
			{ name: "Snacks", initialCount: 2 },
			{ name: "Snacks", initialCount: 2 },
			{ name: "Snacks", initialCount: 2 },
		]);
  },[])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-[8%] bg-background w-[80%] mx-auto mt-10" >
      {itemArr.map((item, index) => (
        <ItemTile
          key={index}
          name={item.name}
          initialCount={item.initialCount}
        />
      ))}
      {!addItemPopup ?
        <button 
        onClick={()=>{setAddItemPopup(true)}}
        className="text-7xl flex justify-center items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square hover:bg-tertiary hover:font-bold active:bg-">
        +
        </button>
        :
        <div className="flex flex-col items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square">
          <input  
          type="text"
          placeholder="Item Name"
          className="border-border border-1 px-2 py-1 my-2 rounded w-auto "
        />
        </div>
        }
      
        {/* </div> */}
    </div>
  );
}
