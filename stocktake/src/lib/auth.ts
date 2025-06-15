import { supabase } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function loginUser(email: string, password: string) {
	const { data: user, error } = await supabase
		.from("users")
		.select("id, password_hash")
		.eq("email", email)
		.single()

	if (error || !user) throw new Error("Invalid email or password") 

	const isValid = await bcrypt.compare(password, user.password_hash)
	if (!isValid) throw new Error("Invalid email or password")

	return { userId: user.id }
}

export async function registerUser(email: string, password: string) {
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	const { error } = await supabase.from("users").insert([
		{
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
