import { supabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateToken } from "./jwt"
import { User, Session } from "@supabase/supabase-js";

export async function loginUser(email: string, password: string): Promise<{
	user: User;
	accessToken: string;
}> { 
	const { data , error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
			})

	if (error || !data.user) throw new Error("Invalid email or password") 

	// console.log("Generating token")
	// //generate token 
	// const token =  await generateToken({
	// 	sub: user.username,
	// 	email: user.email
	// });
	
	// console.log("Generated token")

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
