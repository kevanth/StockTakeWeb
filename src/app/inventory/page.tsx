"use client";

import { useEffect, useState } from "react";
import ItemTile from "@/components/itemTiles";
import AddItemButtonOrForm from "@/components/AddItemButtonOrForm";
import Item from "@/class/Item";
import { Toaster, toast } from "sonner";
import { List, SquareStack } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function Inventory() {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState("Card");
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();

	// Redirect if not authenticated
	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
		}
	}, [user, authLoading, router]);

	const fetchItems = async () => {
		try {
			const { data: { session } } = await supabase.auth.getSession();
			const headers = {
				'Authorization': `Bearer ${session?.access_token}`
			};

			const res = await fetch("/api/item", { headers });
			if (!res.ok) {
				const errorBody = await res.json();
				throw new Error(errorBody.error || "Request failed");
			}
			const data = await res.json();
			setItems(data.items);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unexpected error");
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const { data: { session } } = await supabase.auth.getSession();
			const headers = {
				'Authorization': `Bearer ${session?.access_token}`
			};

			const res = await fetch("/api/category", { headers });
			if (!res.ok) {
				const errorBody = await res.json();
				throw new Error(errorBody.error || "Request failed");
			}
			const data = await res.json();
			return data.categories;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unexpected error");
		}
	};

	useEffect(() => {
		if (user) {
			fetchItems();
		}
	}, [user]);

	// Show loading while checking authentication
	if (authLoading || !user) {
		return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	}

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<Sidebar />

			{/* Content layout next to sidebar */}
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				{/* Toggle View Button */}
				<div className="flex justify-end px-4 sm:px-6">
					<button
						onClick={() => setView(view === "Card" ? "List" : "Card")}
						className="text-foreground"
					>
						{view === "Card" ? <List className="h-6 w-6" /> : <SquareStack className="h-6 w-6" />}
					</button>
				</div>

				{/* Content */}
				<main className="flex-1 p-4 sm:px-6 sm:py-0">
					{loading && <div className="text-center mt-10">Loading...</div>}

					{/* Card View */}
					<div
						className={`${
							view !== "Card" || loading ? "hidden" : ""
						} grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6`}
					>
						{items.map((item) => (
							<ItemTile
								key={item.id}
								item={item}
								refreshItems={fetchItems}
								toast={toast.error}
								getCategories={fetchCategories}
							/>
						))}
						<AddItemButtonOrForm refreshItems={fetchItems} />
					</div>

					{/* List View */}
					<div
						className={`${
							view !== "List" || loading ? "hidden" : ""
						} w-full mt-10`}
					>
						List View Placeholder
					</div>
				</main>
			</div>

			<Toaster />
		</div>
	);
}
