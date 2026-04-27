import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [
    project,
    stages,
    tasks,
    discussions,
    parts,
    vendors,
    files,
    activity
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_stages").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("tasks").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("discussions").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("parts").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("vendors").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("files").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("activity_logs").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(50)
  ]);

  if (!project.data) notFound();
  if (project.error) throw new Error(project.error.message);

  return (
    <ProjectDetail
      project={project.data}
      stages={stages.data ?? []}
      tasks={tasks.data ?? []}
      discussions={discussions.data ?? []}
      parts={parts.data ?? []}
      vendors={vendors.data ?? []}
      files={files.data ?? []}
      activity={activity.data ?? []}
    />
  );
}
