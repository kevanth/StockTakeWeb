import { supabase } from "@/lib/db"

export async function loginUser(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	})

	if (error) {
		throw new Error(error.message)
	}

	return { user: data.user }
}

export async function registerUser(username: string, email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				username: username
			}
		}
	})

	if (error) {
		throw new Error(error.message)
	}

	return { user: data.user }
}

export async function logoutUser() {
	const { error } = await supabase.auth.signOut()
	
	if (error) {
		throw new Error(error.message)
	}
}

export async function getCurrentUser() {
	const { data: { user }, error } = await supabase.auth.getUser()
	
	if (error) {
		throw new Error(error.message)
	}
	
	return user
}
