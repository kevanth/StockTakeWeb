"use client";

import { useRouter } from "next/navigation" 

import { useState } from "react"

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
    
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
    
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
    
        setLoading(false)
    
        if (res.ok) {
            router.push("/inventory")
        } else {
            const data = await res.json()
            setError(data.error || "Something went wrong")
        }
    }
    


    return(
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col bg-card rounded-2xl w-1/3 border-accent border-2 p-10 gap-6">
                <div>
                    <p className="text-xl">
                        Login to your account
                    </p>
                    <p>
                        Don't have an account? <a className="underline" href="Sign Up">Sign Up</a>
                    </p>
                </div>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-2" >
                    <div className="flex flex-col gap-1">  
                        <label>
                            Email
                        </label>
                        <input
                            className="bg- rounded-sm border-2 border-accent"
                            id="email"
                            type="email"
                            value={email}
				            onChange={(e) => setEmail(e.target.value)}  
                            placeholder="m@example.com"
                            required
                        />
                     </div>

                     <div className="flex flex-col gap-1">  
                        <label>
                            Password
                        </label>
                        <input
                            className="bg- rounded-sm border-2 border-accent"
                            id="password"
                            value={password}
				            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                    </div>

                    <button 
                    type="submit"
                    className="w-full rounded-sm border-2 bg-accent-foreground text-accent">
                        Login
                    </button>
                </form>
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                    )}
            </div>
        </div>
    )
}