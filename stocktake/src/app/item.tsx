"use client";
import { useState } from "react";

interface ItemProps {
	name: string;
	initialCount: number;
}

export default function Item({name, initialCount}:ItemProps) {
  const [count,setCount] = useState(initialCount)
  const buttonClass = "border-1 border-border hover:bg-border aspect-square w-8"
  
  return (
    <div className="flex flex-col items-center border text-textPrimary border-border p-4 rounded bg-secondary">
        <p className="text-lg font-bold">{name}</p>
        <input
          type="text"
          value={count}
          onChange={(e) => {
            const val = e.target.value
            if (/^\d*$/.test(val)) {
              setCount(Number(val))
            }
          }}
          className="border px-2 py-1 my2 rounded "
        />
      <div className="flex gap-2">
        <button className={buttonClass} onClick={()=>{setCount((count == 0)?0:count - 1)}}>-</button>
        <button className={buttonClass} onClick={()=>{setCount(count + 1)}}>+</button>
      </div>
    </div>
    
  );
}
