"use client"

import { useState } from "react"

export default function Register() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		})

		setLoading(false)
		console.log("Status code:", res.status)

		if (res.ok) {
			// Optional: redirect to login page or inventory
			window.location.href = "/login"
		} else {
			const data = await res.json()
			setError(data.error || "Something went wrong")
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="flex flex-col bg-card rounded-2xl w-1/3 border-accent border-2 p-10 gap-6">
				<div>
					<p className="text-xl">Create a new account</p>
					<p>
						Already have an account?{" "}
						<a className="underline" href="/login">
							Log In
						</a>
					</p>
				</div>

				<form onSubmit={handleRegister} className="flex flex-col gap-2">
					<div className="flex flex-col gap-1">
						<label>Email</label>
						<input
							className="rounded-sm border-2 border-accent p-1"
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="m@example.com"
							required
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label>Password</label>
						<input
							className="rounded-sm border-2 border-accent p-1"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-sm border-2 bg-accent-foreground text-accent py-1"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>

				{error && <div className="text-red-500 text-sm">{error}</div>}
			</div>
		</div>
	)
}
