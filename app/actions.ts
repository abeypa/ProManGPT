"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { moduleConfigs, schemaFor } from "@/lib/module-config";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

function normalizePayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === "" ? null : value])
  );
}

export async function createModuleRecord(moduleKey: keyof typeof moduleConfigs, formData: FormData) {
  const profile = await requireProfile();
  const config = moduleConfigs[moduleKey];
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith("$ACTION_"))
  );
  const parsed = schemaFor(config).parse(raw);
  const payload: Record<string, unknown> = normalizePayload(parsed);

  if (config.table === "projects") payload.project_manager_id = profile.id;
  if (config.table === "teams") payload.created_by = profile.id;
  if (config.table === "tasks") payload.created_by = profile.id;
  if (config.table === "discussions") payload.created_by = profile.id;
  if (config.table === "parts") payload.suggested_by = profile.id;
  if (config.table === "vendors") payload.updated_by = profile.id;
  if (config.table === "files") payload.uploaded_by = profile.id;

  const supabase = await createClient();
  const { data, error } = await supabase.from(config.table).insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  await supabase.from("activity_logs").insert({
    actor_id: profile.id,
    entity_type: config.table,
    entity_id: data.id,
    action: `${config.table}.created`,
    details: payload
  });

  revalidatePath(config.href);
  if (config.table === "projects") redirect(`/projects/${data.id}`);
}

export async function updateTaskStatus(taskId: string, status: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId);
  if (error) throw new Error(error.message);
  await supabase.from("activity_logs").insert({
    actor_id: profile.id,
    entity_type: "tasks",
    entity_id: taskId,
    action: "task.updated",
    details: { status }
  });
  revalidatePath("/tasks");
}

export async function createProjectChild(formData: FormData) {
  const profile = await requireProfile();
  const type = String(formData.get("type"));
  const projectId = String(formData.get("project_id"));
  const supabase = await createClient();
  const base = { project_id: projectId };
  const map: Record<string, { table: string; payload: Record<string, unknown> }> = {
    stage: {
      table: "project_stages",
      payload: {
        ...base,
        title: formData.get("title"),
        description: formData.get("description") || null,
        status: formData.get("status"),
        progress: Number(formData.get("progress") || 0),
        owner_id: profile.id,
        start_date: formData.get("start_date") || null,
        due_date: formData.get("due_date") || null
      }
    },
    comment: {
      table: "discussion_comments",
      payload: {
        discussion_id: formData.get("discussion_id"),
        author_id: profile.id,
        body: formData.get("body")
      }
    },
    vendor_update: {
      table: "vendor_updates",
      payload: {
        vendor_id: formData.get("vendor_id"),
        updated_by: profile.id,
        status: formData.get("status"),
        note: formData.get("note")
      }
    }
  };
  const entry = map[type];
  if (!entry) throw new Error("Unsupported project action");
  const { error } = await supabase.from(entry.table).insert(normalizePayload(entry.payload));
  if (error) throw new Error(error.message);
  await supabase.from("activity_logs").insert({
    actor_id: profile.id,
    project_id: projectId,
    entity_type: entry.table,
    action: `${entry.table}.created`,
    details: entry.payload
  });
  revalidatePath(`/projects/${projectId}`);
}
