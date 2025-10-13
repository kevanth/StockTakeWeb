"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useBoxes } from "@/lib/hooks/useBoxes";
import { useItems } from "@/lib/hooks/useItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Item, NewItem } from "@/types/models";
import clsx from "clsx";
import React from "react";
import { ItemForm } from "./itemForm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { set } from "lodash";
import { ListFilter, X, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export function InventoryManager() {
  const { activeBox, boxesLoading, boxesError } = useBoxes();
  const [searchItem, setSearchItem] = useState("");
  const [filter, setFilter] = useState("*");

  const [open, setOpen] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Fetch items for the active box
  const { items, itemsLoading, itemsError, addItem, updateItem, deleteItem } =
    useItems(activeBox?.id ?? null);

  // Handle item operations
  const handleAddItem = async (item: NewItem) => {
    if (!item.name.trim() || !activeBox) return;

    try {
      item.owner_id = activeBox.owner_id;
      await addItem(item);
      toast.success("Item added successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add item"
      );
    }

    setOpen(false);
  };

  const handleEditItem = async (item: NewItem) => {
    if (!item.name.trim() || !activeBox) return;
    if (!item.id) {
      toast.error("Item ID is missing.");
      return;
    }
    try {
      await updateItem(item.id, item);
      toast.success("Item updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update item"
      );
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

  const handleQuantityChangeItem = async (
    id: string,
    type: "increase" | "decrease"
  ) => {
    const item = items.find((item: Item) => item.id === id);
    if (!item) return;

    if (item.quantity_mode === "count" || item.quantity_mode === "measure") {
      const updatedQuantity =
        type === "increase"
          ? (item.quantity_value || 0) + 1
          : Math.max((item.quantity_value || 0) - 1, 0);

      handleEditItem({
        ...item,
        quantity_value: updatedQuantity,
      });
    } else if (item.quantity_mode === "level") {
      const currentLevel = item.level || "full";
      let newLevel: "empty" | "low" | "half" | "high" | "full";

      if (type === "increase") {
        newLevel =
          currentLevel === "empty"
            ? "low"
            : currentLevel === "low"
            ? "half"
            : currentLevel === "half"
            ? "high"
            : "full";
      } else {
        newLevel =
          currentLevel === "full"
            ? "high"
            : currentLevel === "high"
            ? "half"
            : currentLevel === "half"
            ? "low"
            : "empty";
      }

      handleEditItem({
        ...item,
        level: newLevel,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Items in {activeBox?.name}</h3>
        {/** Search and Filter */}
        <div className="flex flex-row gap-2 items-center">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="w-full"
          ></Input>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ListFilter />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  filter === "low" ? setFilter("*") : setFilter("low");
                }}
                className={filter === "low" ? "bg-accent" : ""}
              >
                low
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  filter === "empty" ? setFilter("*") : setFilter("empty");
                }}
                className={filter === "empty" ? "bg-accent" : ""}
              >
                empty
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              items
                .filter((item: Item) => {
                  const matchSearch = item.name
                    .toLowerCase()
                    .includes(searchItem.toLowerCase());
                  const matchFilter =
                    filter === "empty"
                      ? item.quantity_value === 0 || item.level === "empty"
                      : filter === "low"
                      ? item.low_stock
                      : true;
                  return matchSearch && matchFilter;
                })
                .map((item: Item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "flex items-center gap-2 p-3 border rounded-lg",
                      item.low_stock && "border-amber-400",
                      (item.quantity_value === 0 || item.level === "empty") &&
                        "border-red-500"
                    )}
                    onClick={() => {
                      setEditingItem(item);
                      setEditForm(true);
                    }}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="">{item.name}</span>
                      <div className="text-gray-400 font-light">
                        {item.quantity_mode} :{" "}
                        {item.quantity_value ? item.quantity_value : item.level}
                        {item.quantity_mode == "measure"
                          ? item.unit_code
                          : null}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <ArrowUpIcon
                        className="size-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChangeItem(item.id, "increase");
                        }}
                      />
                      <ArrowDownIcon
                        className="size-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChangeItem(item.id, "decrease");
                        }}
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
      {/* Add Item Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline">Add Item</Button>
        </DialogTrigger>
        <DialogContent>
          <ItemForm
            onSubmit={(item: NewItem) => {
              handleAddItem(item);
            }}
            item={null}
          />
        </DialogContent>
      </Dialog>

      {/* Item Edit Form Dialog */}
      <Dialog open={editForm} onOpenChange={setEditForm}>
        <DialogContent>
          <ItemForm
            onSubmit={(item: NewItem) => {
              handleEditItem(item);
            }}
            item={editingItem}
          />
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
