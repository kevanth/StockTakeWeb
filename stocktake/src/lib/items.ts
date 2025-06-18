import Item from "@/class/Item";
import { supabase } from "./db";

export async function getItems(username:string): Promise<Item[]> {  
    const { data: items, error } = await supabase
		.from("items")
		.select("*")
		.eq("owner", username)

    if(error) throw new Error("Invalid request: " + error.message)

    return items?.map(row => new Item(row.name, row.quantity)) || [];
}

export async function addItem(username:string, item:Item) {
  const resp = await supabase
  .from("items")
  .insert({owner:username, name:item.name, quantity:item.count, last_updated:new Date().toISOString(),
  })

  if (resp.error) {
    console.error("Insert failed:", resp.error.message, resp.error.details);
    throw new Error("Insert failed: " + resp.error.message + " " + resp.error.details)
  } else {
    console.log("Insert succeeded");
  }  
}