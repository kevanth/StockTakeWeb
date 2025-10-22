import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBoxes } from "@/lib/hooks/useBoxes";
import { Box } from "@/types/models";
import { useUsers } from "@/lib/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Edit, EllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";

export function AppSidebar() {
  const [isAddingBox, setIsAddingBox] = useState(false);
  const [newBoxName, setNewBoxName] = useState("");
  const { boxes, activeBox, addBox, selectBox, updateBox } = useBoxes();
  const { user } = useUsers();
  const [boxDialog, setBoxDialog] = useState(false);

  // Set default box name when dialog opens
  useEffect(() => {
    if (boxDialog && activeBox) {
      setNewBoxName(activeBox.name);
    }
  }, [boxDialog, activeBox]);

  const handleAddBox = async () => {
    if (!newBoxName.trim()) return;

    try {
      await addBox({ name: newBoxName.trim() });
      setNewBoxName("");
      setIsAddingBox(false);
    } catch (error) {
      console.error("Failed to add box:", error);
    }
  };

  const handleCancel = () => {
    setNewBoxName("");
    setIsAddingBox(false);
  };

  const handleBoxSelect = (box: Box) => {
    selectBox(box.id);
  };

  const handleUpdateBox = async () => {
    if (!newBoxName.trim() || !activeBox) return;

    try {
      await updateBox(activeBox.id, { name: newBoxName.trim() });
      setBoxDialog(false);
    } catch (error) {
      console.error("Failed to update box:", error);
    }
  };

  return (
    <div>
      <Sidebar>
        <SidebarHeader className="text-xl p-6">StockTake</SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel>Box Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {boxes.map((box) => (
                  <SidebarMenuItem key={box.id}>
                    <SidebarMenuButton
                      className={`truncate ${
                        activeBox.id === box.id
                          ? "bg-accent text-white"
                          : "  text-white"
                      } flex justify-between`}
                      onClick={() => handleBoxSelect(box)}
                      onDoubleClick={() => {
                        activeBox.id === box.id && setBoxDialog(true);
                      }}
                    >
                      {box.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem className="flex justify-center">
                  {isAddingBox ? (
                    <div className="w-full p-2">
                      <div className="flex flex-col gap-2">
                        <Input
                          type="text"
                          placeholder="Enter box name"
                          value={newBoxName}
                          onChange={(e) => setNewBoxName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddBox();
                            } else if (e.key === "Escape") {
                              handleCancel();
                            }
                          }}
                          className="text-sm"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={handleAddBox}
                            disabled={!newBoxName.trim()}
                            className="flex-1 text-xs"
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SidebarMenuButton
                      className="text-white border-2 border-accent text-center w-8 h-8 rounded-full flex items-center justify-center"
                      onClick={() => setIsAddingBox(true)}
                    >
                      +
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup className="flex flex-row hover:bg-accent rounded-2xl">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <SidebarHeader className="flex-1 pl-3 text-lg">
              {user?.username}
            </SidebarHeader>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={boxDialog} onOpenChange={setBoxDialog}>
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
                value={newBoxName}
                onChange={(e) => setNewBoxName(e.target.value)}
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
                      className="flex items-center justify-between p-2 border rounded-lg bg-gray-50"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {member.full_name ||
                            member.username ||
                            "Unknown User"}
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setBoxDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateBox}
                disabled={!newBoxName.trim() || newBoxName === activeBox?.name}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
