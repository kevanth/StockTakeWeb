"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/db";

type Box = {
	id: string;
	name: string;
};

export function Sidebar() {
	const [boxes, setBoxes] = useState<Box[]>([]);
	const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user, signOut } = useAuth();

	useEffect(() => {
		if (user) {
			fetchBoxes();
		}
	}, [user]);

	useEffect(() => {
		const boxIdFromParams = searchParams.get("boxId");
		if (boxIdFromParams) setSelectedBoxId(boxIdFromParams);
	}, [searchParams]);

	const fetchBoxes = async () => {
		try {
			setLoading(true);
			console.log("Fetching boxes...");
			
			const { data: { session } } = await supabase.auth.getSession();
			const headers = {
				'Authorization': `Bearer ${session?.access_token}`
			};

			const res = await fetch("/api/box", { headers });
			console.log("Box API response status:", res.status);
			
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to load boxes");
			}
			
			const data = await res.json();
			console.log("Boxes data:", data);
			setBoxes(data.boxes);
		} catch (err) {
			console.error("Error fetching boxes:", err);
			toast.error(err instanceof Error ? err.message : "Unexpected error");
		} finally {
			setLoading(false);
		}
	};

	const handleSelect = (box: Box) => {
		setSelectedBoxId(box.id);
		router.push(`?boxId=${box.id}`);
	};

	const handleLogout = async () => {
		try {
			await signOut();
			router.push("/login");
		} catch {
			toast.error("Failed to logout");
		}
	};

	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden h-full w-64 flex-col border-r bg-background px-4 py-6 sm:flex">
			<div className="flex flex-col gap-6 h-full justify-between">
				{/* Top Logo */}
				<div>
					<h1 className="text-2xl font-bold mb-6">StockTake</h1>
					<h2 className="text-sm font-semibold mb-2 text-muted-foreground">Your Boxes</h2>
					{loading ? (
						<div className="text-sm text-muted-foreground">Loading boxes...</div>
					) : (
						<ul className="space-y-1">
							{boxes.map((box) => (
								<li
									key={box.id}
									onClick={() => handleSelect(box)}
									className={cn(
										"cursor-pointer rounded px-3 py-2 text-sm font-medium hover:bg-accent",
										box.id === selectedBoxId && "bg-primary text-primary-foreground"
									)}
								>
									{box.name}
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Bottom Profile */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<User className="h-4 w-4" />
						<span className="text-sm font-medium">
							{user?.user_metadata?.username || user?.email}
						</span>
					</div>
					<Button variant="ghost" size="icon" onClick={handleLogout}>
						<LogOut className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</aside>
	);
}
