import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roles = [
  ["Admin", "Access and manage every project, team, user, approval, file, and activity record."],
  ["Project Manager", "Manage assigned projects, project teams, tasks, approvals, parts, vendors, files, and activity."],
  ["Team Lead", "Manage stages and tasks for their team, review part suggestions, and monitor workload."],
  ["Team Member", "View assigned project context, update assigned tasks, comment, suggest parts, and upload relevant files."]
];

export default function RolesPage() {
  return (
    <>
      <PageHeading title="Roles" description="Role-based access rules implemented through Supabase RLS and app navigation." />
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map(([title, description]) => (
          <Card key={title}>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{description}</p></CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
