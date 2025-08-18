import { supabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateToken } from "./jwt"

export async function loginUser(email: string, password: string): Promise<{ token: string; userId: string }> {
	const { data: user, error } = await supabase
		.from("users")
		.select("username, email, password_hash")
		.eq("email", email)
		.single()

	if (error || !user) throw new Error("Invalid email or password") 
	const isValid = await bcrypt.compare(password, user.password_hash)
	if (!isValid) throw new Error("Incorrect password")
	console.log("Generating token")
	//generate token 
	const token =  await generateToken({
		sub: user.username,
		email: user.email
	});
	
	console.log("Generated token")

	return { token, userId: user.username }
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
