"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useBoxes } from "@/lib/hooks/useBoxes";
import { useItems } from "@/lib/hooks/useItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function InventoryManager() {
  const [newBoxName, setNewBoxName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [editingBoxId, setEditingBoxId] = useState<string | null>(null);
  const [editingBoxName, setEditingBoxName] = useState("");

  const {
    boxes,
    boxesLoading,
    boxesError,
    activeBox,
    selectBox,
    addBox,
    updateBox,
    deleteBox,
  } = useBoxes();

  const { items, itemsLoading, itemsError, addItem, updateItem, deleteItem } =
    useItems(activeBox?.id ?? null);

  // Handle box operations
  const handleAddBox = async () => {
    if (!newBoxName.trim()) return;

    try {
      await addBox({ name: newBoxName.trim() });
      setNewBoxName("");
      toast.success("Box added successfully!");
    } catch (error) {
      toast.error("Failed to add box");
    }
  };

  const handleUpdateBox = async (id: string) => {
    if (!editingBoxName.trim()) return;

    try {
      await updateBox(id, { name: editingBoxName.trim() });
      setEditingBoxId(null);
      setEditingBoxName("");
      toast.success("Box updated successfully!");
    } catch (error) {
      toast.error("Failed to update box");
    }
  };

  const handleDeleteBox = async (id: string) => {
    if (!confirm("Are you sure you want to delete this box?")) return;

    try {
      await deleteBox(id);
      toast.success("Box deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete box");
    }
  };

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
      {/* Box Management Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Box Management</h2>

        {/* Add New Box */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter box name"
            value={newBoxName}
            onChange={(e) => setNewBoxName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddBox()}
          />
          <Button onClick={handleAddBox} disabled={!newBoxName.trim()}>
            Add Box
          </Button>
        </div>

        {/* Boxes List */}
        {boxesLoading ? (
          <div>Loading boxes...</div>
        ) : (
          <div className="space-y-2">
            {boxes.map((box) => (
              <div
                key={box.id}
                className="flex items-center gap-2 p-3 border rounded-lg"
              >
                {editingBoxId === box.id ? (
                  <>
                    <Input
                      value={editingBoxName}
                      onChange={(e) => setEditingBoxName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleUpdateBox(box.id)
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdateBox(box.id)}
                      disabled={!editingBoxName.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingBoxId(null);
                        setEditingBoxName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      className={`flex-1 text-left ${
                        activeBox?.id === box.id
                          ? "font-bold text-blue-600"
                          : ""
                      }`}
                      onClick={() => selectBox(box.id)}
                    >
                      {box.name}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingBoxId(box.id);
                        setEditingBoxName(box.name);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteBox(box.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Item Management Section */}
      {activeBox && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Items in: {activeBox.name}</h2>

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
                <div className="text-gray-500">No items in this box yet.</div>
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
      )}

      {!activeBox && !boxesLoading && boxes.length > 0 && (
        <div className="text-center text-gray-500">
          Select a box to view and manage its items.
        </div>
      )}

      <Toaster />
    </div>
  );
}
