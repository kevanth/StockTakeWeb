"use client";
import { useEffect, useState } from "react";
import ItemTile from "../../components/itemTiles";
import Item from "@/class/Item";
import ItemForm from "@/components/itemForm";

export default function Inventory() {
  const [itemArr, setItemsArr] = useState<Item[]>([]);
  const [addItemPopup, setAddItemPopup] = useState(false);

  const handleAddNewItem = (item : Item) : void => {
      setItemsArr(itemArr => [...itemArr, item]);
      setAddItemPopup(false)
  }


  useEffect(() => {
    setItemsArr([ 
      /**
       * TEMP SOLUTION
       * Thinking of using API to call and store once by save button - easiest solution rn
       */
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
          key = {index}
          item = {new Item(item.name, item.initialCount)}
        />
      ))}
      {!addItemPopup ?
        <button 
        onClick={()=>{setAddItemPopup(true)}}
        className="text-7xl flex justify-center items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square hover:bg-tertiary hover:font-bold active:bg-">
        +
        </button>
        :
        <ItemForm onSubmit={handleAddNewItem}></ItemForm>
        }
      
    </div>
  );
}
