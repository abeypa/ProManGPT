import { AlertTriangle, CheckCircle2, Clock, FolderKanban, ListChecks, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeading } from "@/components/page-heading";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [projects, tasks, delayed, approvals, activity, teams] = await Promise.all([
    supabase.from("projects").select("id,name,client,status,priority,due_date").neq("status", "archived").limit(8),
    supabase.from("tasks").select("id,title,status,priority,due_date").limit(8),
    supabase.from("tasks").select("id", { count: "exact", head: true }).lt("due_date", today).neq("status", "completed"),
    supabase.from("approvals").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("activity_logs").select("id,action,created_at,entity_type").order("created_at", { ascending: false }).limit(8),
    supabase.from("teams").select("id,name,department").limit(8)
  ]);

  const stats = [
    { label: "Active projects", value: projects.data?.length ?? 0, icon: FolderKanban },
    { label: "My tasks", value: tasks.data?.length ?? 0, icon: ListChecks },
    { label: "Delayed tasks", value: delayed.count ?? 0, icon: AlertTriangle },
    { label: "Pending approvals", value: approvals.count ?? 0, icon: Clock },
    { label: "Teams", value: teams.data?.length ?? 0, icon: Users },
    { label: "Recent updates", value: activity.data?.length ?? 0, icon: CheckCircle2 }
  ];

  return (
    <>
      <PageHeading title="Dashboard" description="Operational summary across active projects, assigned work, approvals, and team workload." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Active projects</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <thead><tr><Th>Project</Th><Th>Client</Th><Th>Status</Th><Th>Due</Th></tr></thead>
              <tbody>
                {(projects.data ?? []).map((project) => (
                  <tr key={project.id}><Td>{project.name}</Td><Td>{project.client}</Td><Td><Badge value={project.status} /></Td><Td>{formatDate(project.due_date)}</Td></tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent project updates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(activity.data ?? []).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border bg-white p-3 text-sm">
                <span>{item.action}</span>
                <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
