"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useBoxes } from "@/lib/hooks/useBoxes";
import { useItems } from "@/lib/hooks/useItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Item } from "@/types/models";
import clsx from "clsx";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import React from "react";
import { ItemForm } from "./itemForm";

export function InventoryManager() {
  const [addItemMode, setAddItemMode] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const clickOutsideRef = React.useRef(null);
  const { activeBox, boxesLoading, boxesError } = useBoxes();
  const [searchItem, setSearchItem] = useState("");

  // Fetch items for the active box
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

  if (!activeBox && !boxesLoading) {
    return (
      <div className="p-6 space-y-6">
        <Separator />
        <div className="text-gray-500">
          Please select a box from the sidebar.
        </div>
        <Toaster />
      </div>
    );
  }

  useClickOutside(clickOutsideRef, () => {
    if (addItemMode) {
      setAddItemMode(false);
      setNewItemName("");
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Items in {activeBox?.name}</h3>
        <Input
          type="text"
          placeholder="Search items..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          className="w-full"
        ></Input>
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
              items
                .filter((item: Item) =>
                  item.name.toLowerCase().includes(searchItem.toLowerCase())
                )
                .map((item: Item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "flex items-center gap-2 p-3 border rounded-lg",
                      item.low_stock && "border-amber-400",
                      (item.quantity_value === 0 || item.level === "empty") &&
                        "border-red-500"
                    )}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="">{item.name}</span>
                      <div className="text-gray-400 font-light">
                        {item.quantity_mode} : {item.quantity_value}
                        {item.quantity_mode == "measure"
                          ? item.unit_code
                          : null}
                      </div>
                    </div>
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
      {addItemMode ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-1/3 bg-accent p-6 rounded-lg" ref={clickOutsideRef}>
            <ItemForm
              onSubmit={handleAddItem}
              onCancel={() => setAddItemMode(false)}
            ></ItemForm>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => {
            setAddItemMode(true);
          }}
        >
          Add Item
        </Button>
      )}
      <Toaster />
    </div>
  );
}
