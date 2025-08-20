import bcrypt from "bcryptjs"
import { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";

export async function loginUser(email: string, password: string): Promise<{
	user: User;
	accessToken: string;
}> {
	 const supabase = await createClient()
	const { data , error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
			})

	if (error || !data.user) throw new Error("Invalid email or password") 
	return { user: data.user, accessToken: data.session.access_token }
}

export async function registerUser(username: string, email: string, password: string): Promise<{ success: boolean }> {
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	const { error } = await supabase.from("users").insert([
		{	
			username,
			email,
			password_hash: hashedPassword,
		},
	])

	if (error) {
		if (error.code === "23505") {
			// Unique violation on email
			throw new Error("Email already registered")
		}

		console.error("❌ DB insert error:", error)
		throw new Error("Failed to create user")
	}

	return { success: true }
}
