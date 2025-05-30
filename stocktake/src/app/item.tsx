"use client";
import { useState } from "react";
interface ItemProps {
	name: string;
	initialCount: number;
}

export default function Item({name, initialCount}:ItemProps) {
  const [count,setCount] = useState(initialCount)
  const buttonClass = "border-1 hover:bg-blue-500"
  
  return (
    <div className="flex flex-col items-center border border-gray-400 p-4 rounded">
        <p className="text-lg font-bold">{name}</p>
        <p className="text-sm text-gray-700">Count: {count}</p>
      <div className="flex gap-2">
        <button className={buttonClass} onClick={()=>{setCount((count == 0)?0:count - 1)}}>-</button>
        <button className={buttonClass} onClick={()=>{setCount(count + 1)}}>+</button>
      </div>
    </div>
    
  );
}
