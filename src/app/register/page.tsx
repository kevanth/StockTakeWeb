"use client";

import { useRouter } from "next/navigation" 
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context";

export default function Register() {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
    
    const router = useRouter()
    const { signUp, user, loading: authLoading } = useAuth()

    // Redirect if already authenticated
    useEffect(() => {
        if (user && !authLoading) {
            console.log("User is authenticated, redirecting to inventory")
            router.push("/inventory")
        }
    }, [user, authLoading, router])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
    
        console.log("Attempting registration...")
        const { error } = await signUp(email, password, username)
    
        setLoading(false)
    
        if (error) {
            console.error("Registration error:", error)
            setError(error.message || "Something went wrong")
        } else {
            console.log("Registration successful, waiting for auth state update...")
            // The redirect will happen automatically via useEffect when user state updates
        }
    }

    // Show loading if auth is being checked
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    // Don't show register form if already authenticated
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p>Redirecting...</p>
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-muted/40">
            <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
                
                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-border rounded bg-background text-foreground"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-border rounded bg-background text-foreground"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-border rounded bg-background text-foreground"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground p-3 rounded font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>
                
                <p className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-primary hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    )
}
