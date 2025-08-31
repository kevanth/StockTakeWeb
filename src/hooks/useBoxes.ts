"use client";

import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Box = { id: string; name: string };

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export function useBoxes() {
  const { data, error, isLoading, mutate } = useSWR<{ boxes: Box[] }>(
    "/api/box",
    fetcher,
    { revalidateOnFocus: false }
  );
  const boxes = data?.boxes ?? [];

  // selection is URL-based
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeBoxIdFromUrl = searchParams.get("boxId") ?? null;
  const activeBox =
    boxes.find((b) => b.id === activeBoxIdFromUrl) ?? boxes[0] ?? null;
  const activeBoxId = activeBox?.id ?? null;

  // update URL to select box
  function selectBox(id: string) {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("boxId", id);
    router.replace(`${pathname}?${sp.toString()}`);
  }

  // add a box then refresh cache
  async function addBox(payload: { name: string }) {
    const res = await fetch("/api/box", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add box");
    await mutate(); // refresh box list everywhere
  }

  return {
    boxes,
    boxesLoading: isLoading,
    boxesError: error as Error | undefined,
    activeBox,
    activeBoxId,
    selectBox,
    addBox,
    mutateBoxes: mutate,
  };
}
