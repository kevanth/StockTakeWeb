"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BoxWithMembers } from "@/types/models";
import { PlusIcon } from "lucide-react";

interface EditBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeBox: BoxWithMembers | null;
  onUpdate: (boxId: string, name: string) => Promise<void>;
  onDelete: (boxId: string) => Promise<void>;
}

export function EditBoxDialog({
  open,
  onOpenChange,
  activeBox,
  onUpdate,
  onDelete,
}: EditBoxDialogProps) {
  const [boxName, setBoxName] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Set default box name when dialog opens
  useEffect(() => {
    if (open && activeBox) {
      setBoxName(activeBox.name);
    }
  }, [open, activeBox]);

  const handleUpdateBox = async () => {
    if (!boxName.trim() || !activeBox) return;

    try {
      await onUpdate(activeBox.id, boxName.trim());
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update box:", error);
    }
  };

  const handleRemoveBox = async () => {
    if (!activeBox) return;

    try {
      await onDelete(activeBox.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete box:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Box</DialogTitle>
          <DialogDescription>
            Make changes to your box here, click save when done
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Box Name */}
          <div className="space-y-2">
            <Label htmlFor="box-name">Box Name</Label>
            <Input
              id="box-name"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              placeholder="Enter box name"
              className="w-full"
            />
          </div>

          {/* Members Section */}
          <div className="space-y-2">
            <Label>Members ({activeBox?.members.length || 0})</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeBox?.members && activeBox.members.length > 0 ? (
                activeBox.members.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {member.full_name || member.username || "Unknown User"}
                      </span>
                      {member.role && (
                        <span className="text-xs text-gray-500 capitalize">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No members yet
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAddingMember(true);
            }}
          >
            <PlusIcon />
          </Button>
          {isAddingMember && (
            <div className="space-y-2">
              <Label>Add Member</Label>
              <Input type="text" placeholder="Enter member email" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-row gap-2 pt-4">
            <div>
              <Button variant="outline" onClick={handleRemoveBox}>
                Delete Box
              </Button>
            </div>
            <div className="flex justify-end gap-2 flex-1">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateBox}
                disabled={!boxName.trim() || boxName === activeBox?.name}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
