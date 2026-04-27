import { KanbanBoard } from "@/components/kanban-board";
import { ModuleForm } from "@/components/module-form";
import { ModuleTable } from "@/components/module-table";
import { PageHeading } from "@/components/page-heading";
import { moduleConfigs } from "@/lib/module-config";
import { createClient } from "@/lib/supabase/server";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <>
      <PageHeading title="Tasks" description="Manage assigned work in list and Kanban views." />
      <div className="space-y-6">
        <KanbanBoard tasks={rows} />
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <ModuleTable config={moduleConfigs.tasks} rows={rows} />
          <ModuleForm config={moduleConfigs.tasks} />
        </div>
      </div>
    </>
  );
}
