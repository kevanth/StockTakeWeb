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
  const { boxes, activeBox, addBox, selectBox } = useBoxes();
  const { user } = useUsers();
  const [boxDialog, setBoxDialog] = useState(false);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Box</DialogTitle>
            <DialogDescription>
              Make changes to your box here, click save when done
            </DialogDescription>
          </DialogHeader>
          <hr />
          <form>
            {activeBox && (
              <div
                contentEditable
                onBlur={(e) => setNewBoxName(e.target.textContent || "")}
                className="hover:bg-accent ph-2 mb-2 w-fit"
              >
                activeBox.name
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
