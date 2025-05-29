"use client";
import { useState } from "react";

export default function Home() {
  const [count,setCount] = useState(0)
  const buttonClass = "border-1 hover:border-2"
  
  return (
    <div className="flex flex-col items-center border-1">
      {count}
      <div className="flex gap-2">
        <button className={buttonClass} onClick={()=>{setCount((count == 0)?0:count - 1)}}>-</button>
        <button className={buttonClass} onClick={()=>{setCount(count + 1)}}>+</button>
      </div>
    </div>
    
  );
}
