"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

type Box = {
	id: number;
	name: string;
};

export function Sidebar() {
	const [boxes, setBoxes] = useState<Box[]>([]);
	const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		fetchBoxes();
		const boxIdFromParams = Number(searchParams.get("boxId"));
		if (boxIdFromParams) setSelectedBoxId(boxIdFromParams);
	}, []);

	const fetchBoxes = async () => {
		try {
			const res = await fetch("/api/box");
			if (!res.ok) throw new Error("Failed to load boxes");
			const data = await res.json();
			setBoxes(data.boxes);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Unexpected error");
		}
	};

	const handleSelect = (box: Box) => {
		setSelectedBoxId(box.id);
		router.push(`?boxId=${box.id}`);
	};

	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden h-full w-64 flex-col border-r bg-background px-4 py-6 sm:flex">
			<div className="flex flex-col gap-6 h-full justify-between">
				{/* Top Logo */}
				<div>
					<h1 className="text-2xl font-bold mb-6">StockTake</h1>
					<h2 className="text-sm font-semibold mb-2 text-muted-foreground">Your Boxes</h2>
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
				</div>

				{/* Bottom Profile (icon only for now) */}
				<div className="flex items-center justify-between">
					<Button variant="ghost" size="icon">
						<User />
					</Button>
				</div>
			</div>
		</aside>
	);
}
