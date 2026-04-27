import { createModuleRecord } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import type { ModuleConfig } from "@/lib/module-config";
import { createClient } from "@/lib/supabase/server";
import { titleCase } from "@/lib/utils";

export async function ModuleForm({ config }: { config: ModuleConfig }) {
  const action = createModuleRecord.bind(null, config.key as never);
  const supabase = await createClient();
  const [projects, teams, profiles, stages] = await Promise.all([
    supabase.from("projects").select("id,name").order("name"),
    supabase.from("teams").select("id,name").order("name"),
    supabase.from("profiles").select("id,full_name").order("full_name"),
    supabase.from("project_stages").select("id,title").order("title")
  ]);
  const needsProject = ["tasks", "discussions", "parts", "vendors", "files"].includes(config.key);
  const needsTeam = config.key === "tasks";
  const needsAssignee = config.key === "tasks";
  const needsStage = config.key === "tasks";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.createLabel}</CardTitle>
        <CardDescription>Required fields are validated before Supabase insert policies run.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4 md:grid-cols-2">
          {needsProject ? (
            <label className="block">
              <span className="text-sm font-medium">Project</span>
              <select name="project_id" required className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
                <option value="">Select project</option>
                {(projects.data ?? []).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </label>
          ) : null}
          {needsTeam ? (
            <label className="block">
              <span className="text-sm font-medium">Team</span>
              <select name="team_id" className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
                <option value="">Select team</option>
                {(teams.data ?? []).map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </label>
          ) : null}
          {needsStage ? (
            <label className="block">
              <span className="text-sm font-medium">Stage</span>
              <select name="stage_id" className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
                <option value="">Select stage</option>
                {(stages.data ?? []).map((stage) => <option key={stage.id} value={stage.id}>{stage.title}</option>)}
              </select>
            </label>
          ) : null}
          {needsAssignee ? (
            <label className="block">
              <span className="text-sm font-medium">Assignee</span>
              <select name="assignee_id" className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
                <option value="">Select assignee</option>
                {(profiles.data ?? []).map((profile) => <option key={profile.id} value={profile.id}>{profile.full_name ?? profile.id}</option>)}
              </select>
            </label>
          ) : null}
          {config.fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" ? "block md:col-span-2" : "block"}>
              <span className="text-sm font-medium">{field.label}</span>
              {field.type === "textarea" ? (
                <Textarea name={field.name} required={field.required} className="mt-1" />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  defaultValue={field.options?.[0]}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {titleCase(option)}
                    </option>
                  ))}
                </select>
              ) : (
                <Input name={field.name} type={field.type} required={field.required} className="mt-1" />
              )}
            </label>
          ))}
          <div className="md:col-span-2">
            <Button>{config.createLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
