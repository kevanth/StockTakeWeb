"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
	const router = useRouter();
	const { user, loading } = useAuth();

	useEffect(() => {
		if (!loading) {
			if (user) {
				router.push("/inventory");
			} else {
				router.push("/login");
			}
		}
	}, [user, loading, router]);

	// Show loading while checking authentication
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold mb-4">StockTake</h1>
				<p>Loading...</p>
			</div>
		</div>
	);
}