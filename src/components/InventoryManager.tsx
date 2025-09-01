"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useBoxes } from "@/lib/hooks/useBoxes";
import { useItems } from "@/lib/hooks/useItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function InventoryManager() {
  const [newItemName, setNewItemName] = useState("");

  const { activeBox, boxesLoading, boxesError } = useBoxes();

  const { items, itemsLoading, itemsError, addItem, updateItem, deleteItem } =
    useItems(activeBox?.id ?? null);

  // Handle item operations
  const handleAddItem = async () => {
    if (!newItemName.trim() || !activeBox) return;

    try {
      await addItem({
        name: newItemName.trim(),
        boxId: activeBox.id,
      });
      setNewItemName("");
      toast.success("Item added successfully!");
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItem(id);
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  if (boxesError) {
    return (
      <div className="text-red-500">
        Error loading boxes: {boxesError.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Box Information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Inventory Management</h2>

        {!activeBox && !boxesLoading && (
          <div className="text-center text-gray-500 p-8">
            <p className="text-lg">
              Please select a box from the sidebar to manage its items.
            </p>
          </div>
        )}

        {activeBox && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">
              Currently managing: {activeBox.name}
            </h3>
          </div>
        )}
      </div>

      {/* Item Management Section */}
      {activeBox && (
        <>
          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Items in {activeBox.name}</h3>

            {/* Add New Item */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
              />
              <Button onClick={handleAddItem} disabled={!newItemName.trim()}>
                Add Item
              </Button>
            </div>

            {/* Items List */}
            {itemsLoading ? (
              <div>Loading items...</div>
            ) : itemsError ? (
              <div className="text-red-500">
                Error loading items: {itemsError.message}
              </div>
            ) : (
              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="text-gray-500 text-center p-8">
                    <p>No items in this box yet.</p>
                    <p className="text-sm mt-2">Add your first item above!</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-3 border rounded-lg"
                    >
                      <span className="flex-1">{item.name}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}

      <Toaster />
    </div>
  );
}
