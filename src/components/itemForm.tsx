"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Item, NewItem } from "@/types/models";

export function ItemForm({
  item,
  onSubmit,
}: {
  item: Item | null;
  onSubmit: (item: NewItem) => void;
}) {
  const [name, setName] = useState("");
  const [quantityMode, setQuantityMode] = useState("count");
  const [quantityValue, setQuantityValue] = useState<number | null>(null);
  const [reorderThreshold, setReorderThreshold] = useState<number | null>(null);
  const [unitCode, setUnitCode] = useState<string | null>(null);
  const [level, setLevel] = useState("full");
  const [reorderLevel, setReorderLevel] = useState("");

  useEffect(() => {
    if (item) {
      console.log("form", item);
      setName(item.name);
      setQuantityMode(item.quantity_mode);
      setQuantityValue(item.quantity_value || null);
      setUnitCode(item.unit_code || null);
      setLevel(item.level || "full");
      setReorderLevel(item.reorder_level || "");
      setReorderThreshold(item.reorder_threshold || null);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      box_id: "", // to be set in parent
      owner_id: "", // to be set in parent
      quantity_mode: quantityMode as "count" | "measure" | "level",
      unit_code: unitCode ? unitCode.trim() : null,
      quantity_value: quantityValue ? quantityValue : null,
      level:
        quantityMode === "level"
          ? (level as "full" | "empty" | "low" | "half" | "high")
          : null,
      reorder_level:
        quantityMode === "level"
          ? (reorderLevel as "full" | "empty" | "low" | "half" | "high")
          : null,
      id: item?.id || "",
      reorder_threshold:
        quantityMode === "count" || quantityMode === "measure"
          ? reorderThreshold
          : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setName(e.target.textContent || "")}
          className="text-lg font-semibold border-b border-gray-200 pb-2 outline-none focus:border-b-2 focus:border-blue-500 min-h-[1.5rem]"
          style={{ minHeight: "1.5rem" }}
        >
          {name || "Item Name"}
        </div>
      </div>

      {/* Quantity Mode */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="quantityMode">Quantity Mode</Label>
        <Select
          value={quantityMode}
          onValueChange={(v) => {
            if (v === "count" || v === "measure" || v === "level") {
              setQuantityMode(v);
            }
          }}
        >
          <SelectTrigger id="quantityMode">
            <SelectValue placeholder="Select a mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="measure">Measure</SelectItem>
            <SelectItem value="level">Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quantity Value */}
      {(quantityMode === "count" || quantityMode === "measure") && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="quantityValue">Quantity</Label>
          <Input
            id="quantityValue"
            type="number"
            value={quantityValue !== null ? quantityValue : ""}
            onChange={(e) =>
              setQuantityValue(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
          <Label htmlFor="reorderThreshold">Reorder Treshold</Label>
          <Input
            id="reorderThreshold"
            type="number"
            value={reorderThreshold !== null ? reorderThreshold : ""}
            onChange={(e) =>
              setReorderThreshold(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        </div>
      )}

      {/* Unit Code */}
      {quantityMode === "measure" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="unitCode">Unit</Label>
          <Input
            id="unitCode"
            type="text"
            value={unitCode ?? ""}
            onChange={(e) => setUnitCode(e.target.value)}
            placeholder="e.g. kg, L"
          />
        </div>
      )}

      {/* Level */}
      {quantityMode === "level" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="level">Level</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empty">Empty</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
          <Label> Reorder Level </Label>
          <Select value={reorderLevel} onValueChange={setReorderLevel}>
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empty">Empty</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="submit" onClick={() => handleSubmit}>
          Save Item
        </Button>
      </div>
    </form>
  );
}
