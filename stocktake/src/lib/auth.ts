import { supabase } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function loginUser(email: string, password: string) {
	const { data: user, error } = await supabase
		.from("users")
		.select("id, password_hash")
		.eq("email", email)
		.single()

	if (error || !user) return { error: "Invalid email or password" }

	const isValid = await bcrypt.compare(password, user.password_hash)
	if (!isValid) return { error: "Invalid email or password" }

	return { userId: user.id }
}
