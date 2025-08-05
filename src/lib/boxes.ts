import { supabase } from "./db";

export interface Box {
	id: string;
	name: string;
	created_by: string;
	created_at: string;
}

export interface BoxMember {
	id: string;
	box_id: string;
	user_id: string;
	role: 'owner' | 'admin' | 'member';
	created_at: string;
}

export async function getBoxes(): Promise<Box[]> {
	const { data, error } = await supabase
		.from("boxes")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Fetch boxes failed:", error.message, error.details);
		throw new Error("Fetch boxes failed: " + error.message);
	}

	return data || [];
}

export async function getMyBoxes(): Promise<Box[]> {
	const { data, error } = await supabase
		.from("box_members")
		.select(`
			box_id,
			boxes (
				id,
				name,
				created_by,
				created_at
			)
		`)
		.eq("user_id", (await supabase.auth.getUser()).data.user?.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Fetch my boxes failed:", error.message, error.details);
		throw new Error("Fetch my boxes failed: " + error.message);
	}

	return data?.map(item => item.boxes).flat().filter(Boolean) as Box[] || [];
}

export async function getBox(id: string): Promise<Box | null> {
	const { data, error } = await supabase
		.from("boxes")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Fetch box failed:", error.message, error.details);
		throw new Error("Fetch box failed: " + error.message);
	}

	return data;
}

export async function createBox(name: string): Promise<Box> {
	const { data, error } = await supabase
		.from("boxes")
		.insert({
			name: name
		})
		.select()
		.single();

	if (error) {
		console.error("Create box failed:", error.message, error.details);
		throw new Error("Create box failed: " + error.message);
	}

	return data;
}

export async function updateBox(id: string, name: string): Promise<Box> {
	const { data, error } = await supabase
		.from("boxes")
		.update({
			name: name
		})
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Update box failed:", error.message, error.details);
		throw new Error("Update box failed: " + error.message);
	}

	return data;
}

export async function deleteBox(id: string): Promise<void> {
	const { error } = await supabase
		.from("boxes")
		.delete()
		.eq("id", id);

	if (error) {
		console.error("Delete box failed:", error.message, error.details);
		throw new Error("Delete box failed: " + error.message);
	}
}

export async function addBoxMember(boxId: string, userId: string, role: 'owner' | 'admin' | 'member' = 'member'): Promise<void> {
	const { error } = await supabase
		.from("box_members")
		.insert({
			box_id: boxId,
			user_id: userId,
			role: role
		});

	if (error) {
		console.error("Add box member failed:", error.message, error.details);
		throw new Error("Add box member failed: " + error.message);
	}
}

export async function removeBoxMember(boxId: string, userId: string): Promise<void> {
	const { error } = await supabase
		.from("box_members")
		.delete()
		.eq("box_id", boxId)
		.eq("user_id", userId);

	if (error) {
		console.error("Remove box member failed:", error.message, error.details);
		throw new Error("Remove box member failed: " + error.message);
	}
}

export async function getBoxMembers(boxId: string): Promise<BoxMember[]> {
	const { data, error } = await supabase
		.from("box_members")
		.select("*")
		.eq("box_id", boxId);

	if (error) {
		console.error("Fetch box members failed:", error.message, error.details);
		throw new Error("Fetch box members failed: " + error.message);
	}

	return data || [];
} 