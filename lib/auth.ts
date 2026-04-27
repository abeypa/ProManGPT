import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "project_manager" | "team_lead" | "team_member";

export type Profile = {
  id: string;
  full_name: string | null;
  role: AppRole;
  status: string | null;
  team_id: string | null;
  email?: string | null;
};

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, status, team_id")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    full_name: profile?.full_name ?? user.user_metadata?.full_name ?? user.email ?? "User",
    role: (profile?.role ?? "team_member") as AppRole,
    status: profile?.status ?? "active",
    team_id: profile?.team_id ?? null
  } satisfies Profile;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export function canManage(role: AppRole) {
  return role === "admin" || role === "project_manager";
}
