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

export async function addItem(username:String, item:Item) {

}