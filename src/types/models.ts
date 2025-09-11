import type { Database } from "@/types/supabase";

export type Item = Database["public"]["Tables"]["items"]["Row"];
export type NewItem = Database["public"]["Tables"]["items"]["Insert"];
export type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

export type QuantityMode = Database["public"]["Enums"]["quantity_mode"];
export type Level = Database["public"]["Enums"]["level_t"];

export type Box = Database["public"]["Tables"]["boxes"]["Row"];

export type User = Database["public"]["Tables"]["user_profiles"]["Row"]