"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Item, NewItem } from "@/types/models";

export function useItems(boxId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ items: Item[] }>(
    boxId ? `/api/item?boxId=${boxId}` : null, // null pauses the fetch
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  const items = data?.items || [];

  // Add a new item and refresh cache
  async function addItem(arg: { item: NewItem }) {
    const res = await fetch("/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add item");
    await mutate(); // refresh items list
  }

  // Update an existing item and refresh cache
  async function updateItem(id: string, payload: Partial<Item>) {
    const res = await fetch(`/api/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update item");
    await mutate(); // refresh items list
  }

  // Delete an item and refresh cache
  async function deleteItem(id: string) {
    const res = await fetch(`/api/item/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete item");
    await mutate(); // refresh items list
  }

  return {
    items,
    itemsLoading: isLoading,
    itemsError: error as Error | undefined,
    addItem,
    updateItem,
    deleteItem,
    mutateItems: mutate,
  };
}
