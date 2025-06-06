"use client";
import { useState } from "react";
import Item from "@/class/Item";

export default function ItemTile({name, initialCount}:Item) {
  const [count,setCount] = useState(initialCount)
  const buttonClass = "border-1 border-border hover:bg-border aspect-square w-8"
  
  return (
    <div className="flex flex-col items-center border text-textPrimary border-border p-4 rounded bg-secondary aspect-square">
        <p className="text-lg font-bold">{name}</p>
        <input  //So far only changing visually and not changing actual value of item count
          type="text"
          value={count}
          onChange={(e) => {
            const val = e.target.value
            if (/^\d*$/.test(val)) {
              setCount(Number(val))
            }
          }}
          maxLength={5}
          className="border-border border-1 px-2 py-1 my-2 rounded w-auto max-w-[8ch]"
        />
      <div className="flex gap-2 my-2">
        <button className={buttonClass} onClick={()=>{setCount((count == 0)?0:count - 1)}}>-</button>
        <button className={buttonClass} onClick={()=>{setCount(count + 1)}}>+</button>
      </div>
    </div>
    
  );
}
