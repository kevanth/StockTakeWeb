import type { Database } from "@/types/supabase";

export type Item = Database["public"]["Tables"]["items"]["Row"];
export type NewItem = Database["public"]["Tables"]["items"]["Insert"];
export type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

export type QuantityMode = Database["public"]["Enums"]["quantity_mode"];
export type Level = Database["public"]["Enums"]["level_t"];

export type Box = Database["public"]["Tables"]["boxes"]["Row"];
export type BoxMember = Database["public"]["Tables"]["box_members"]["Row"];
export type User = Database["public"]["Tables"]["user_profiles"]["Row"];

// Use the view for box members with user profiles
export type BoxMemberProfile = Database["public"]["Views"]["box_member_profiles"]["Row"];

export type BoxWithMembers = Box & {
  members: BoxMemberProfile[];
};

// Helper functions for working with BoxWithMembers
export const getBoxMembers = (box: BoxWithMembers) => box.members;
export const getBoxOwner = (box: BoxWithMembers) => 
  box.members.find(member => member.role === "owner");
export const getBoxAdmins = (box: BoxWithMembers) => 
  box.members.filter(member => member.role === "admin");
export const getBoxRegularMembers = (box: BoxWithMembers) => 
  box.members.filter(member => member.role === "member");
export const getMemberIds = (box: BoxWithMembers) => 
  box.members.map(member => member.user_id);
export const isUserMember = (box: BoxWithMembers, userId: string) => 
  box.members.some(member => member.user_id === userId);
