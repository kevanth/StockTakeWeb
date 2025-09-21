"use client";

import { useState } from "react";
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

export function ItemForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [quantityMode, setQuantityMode] = useState("count");
  const [quantityValue, setQuantityValue] = useState(0);
  const [unitCode, setUnitCode] = useState("pcs");
  const [level, setLevel] = useState("full");
  const [lowStock, setLowStock] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      quantity_mode: quantityMode,
      quantity_value: quantityValue,
      unit_code: unitCode,
      level,
      low_stock: lowStock,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rice"
          required
        />
      </div>

      {/* Quantity Mode */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="quantityMode">Quantity Mode</Label>
        <Select value={quantityMode} onValueChange={setQuantityMode}>
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="quantityValue">Quantity Value</Label>
        <Input
          id="quantityValue"
          type="number"
          value={quantityValue}
          onChange={(e) => setQuantityValue(Number(e.target.value))}
        />
      </div>

      {/* Unit Code */}
      {quantityMode === "measure" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="unitCode">Unit</Label>
          <Input
            id="unitCode"
            type="text"
            value={unitCode}
            onChange={(e) => setUnitCode(e.target.value)}
            placeholder="e.g. kg, L"
          />
        </div>
      )}

      {/* Level */}
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
      </div>

      {/* Low Stock */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="lowStock"
          checked={lowStock}
          onChange={(e) => setLowStock(e.target.checked)}
        />
        <Label htmlFor="lowStock">Low Stock Warning</Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  );
}
