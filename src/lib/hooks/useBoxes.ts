"use client";

import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/utils";

export type Box = { id: string; name: string; owner_id?: string };

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
    try {
      // Optimistic update
      const optimisticBox = { id: `temp-${Date.now()}`, name: payload.name, owner_id: undefined };
      const optimisticData = { boxes: [...boxes, optimisticBox] };
      
      // Update cache optimistically
      mutate(optimisticData, false);
      
      const res = await fetch(`/api/box?box_name=${encodeURIComponent(payload.name)}`, {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to add box");
      
      // Refresh with real data
      await mutate();
    } catch (error) {
      // Revert optimistic update on error
      await mutate();
      throw error;
    }
  }

  // update a box then refresh cache
  async function updateBox(id: string, payload: { name: string }) {
    try {
      // Optimistic update
      const optimisticData = {
        boxes: boxes.map(box => 
          box.id === id ? { ...box, name: payload.name } : box
        )
      };
      
      mutate(optimisticData, false);
      
      const res = await fetch(`/api/box/${id}?box_name=${encodeURIComponent(payload.name)}`, {
        method: "PUT",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update box");
      
      await mutate();
    } catch (error) {
      await mutate();
      throw error;
    }
  }

  // delete a box then refresh cache
  async function deleteBox(id: string) {
    try {
      // Optimistic update
      const optimisticData = {
        boxes: boxes.filter(box => box.id !== id)
      };
      
      mutate(optimisticData, false);
      
      const res = await fetch(`/api/box/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete box");
      
      await mutate();
    } catch (error) {
      await mutate();
      throw error;
    }
  }

  return {
    boxes,
    boxesLoading: isLoading,
    boxesError: error as Error | undefined,
    activeBox,
    activeBoxId,
    selectBox,
    addBox,
    updateBox,
    deleteBox,
    mutateBoxes: mutate,
  };
}
