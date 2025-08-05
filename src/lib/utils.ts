import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./db"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getAuthHeaders() {
	const { data: { session } } = await supabase.auth.getSession();
	return {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${session?.access_token}`
	};
}