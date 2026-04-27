import { createProjectChild } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";
import { workStatuses, vendorStatuses } from "@/lib/constants";
import { formatDate, titleCase } from "@/lib/utils";

type Row = Record<string, unknown>;

function MiniTable({ title, rows, columns }: { title: string; rows: Row[]; columns: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{rows.length} records</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="rounded-md border border-dashed bg-white p-6 text-sm text-muted-foreground">No records yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <thead><tr>{columns.map((column) => <Th key={column}>{titleCase(column)}</Th>)}</tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)} className="bg-white">
                    {columns.map((column) => (
                      <Td key={column}>
                        {column.includes("date") || column === "created_at" ? formatDate(row[column] as string | null) :
                          ["status", "priority", "approval_status", "category"].includes(column) ? <Badge value={String(row[column])} /> :
                          String(row[column] ?? "Not set")}
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ProjectDetail({
  project,
  stages,
  tasks,
  discussions,
  parts,
  vendors,
  files,
  activity
}: {
  project: Row;
  stages: Row[];
  tasks: Row[];
  discussions: Row[];
  parts: Row[];
  vendors: Row[];
  files: Row[];
  activity: Row[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border bg-white p-5 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{String(project.name)}</h1>
            <Badge value={String(project.status)} />
            <Badge value={String(project.priority)} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{String(project.description ?? "No description provided.")}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Client</p><p className="font-medium">{String(project.client)}</p></div>
          <div><p className="text-muted-foreground">Due date</p><p className="font-medium">{formatDate(project.due_date as string | null)}</p></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <MiniTable title="Stages" rows={stages} columns={["title", "status", "progress", "start_date", "due_date"]} />
          <MiniTable title="Tasks" rows={tasks} columns={["title", "priority", "status", "due_date"]} />
          <MiniTable title="Discussions" rows={discussions} columns={["title", "category", "status", "is_final_decision"]} />
          <MiniTable title="Parts" rows={parts} columns={["part_name", "vendor", "price", "approval_status"]} />
          <MiniTable title="Vendors" rows={vendors} columns={["vendor_name", "item", "status", "delivery_date"]} />
          <MiniTable title="Files" rows={files} columns={["file_name", "category", "mime_type", "file_size"]} />
          <MiniTable title="Activity" rows={activity} columns={["action", "entity_type", "created_at"]} />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Add stage</CardTitle><CardDescription>Team leads and managers can create project stages.</CardDescription></CardHeader>
            <CardContent>
              <form action={createProjectChild} className="space-y-3">
                <input type="hidden" name="type" value="stage" />
                <input type="hidden" name="project_id" value={String(project.id)} />
                <Input name="title" placeholder="Stage title" required />
                <Textarea name="description" placeholder="Description" />
                <select name="status" className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
                  {workStatuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
                </select>
                <Input name="progress" type="number" min="0" max="100" placeholder="Progress %" />
                <Input name="start_date" type="date" />
                <Input name="due_date" type="date" />
                <Button>Add stage</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Vendor update</CardTitle><CardDescription>Add a purchase status note for a vendor item.</CardDescription></CardHeader>
            <CardContent>
              <form action={createProjectChild} className="space-y-3">
                <input type="hidden" name="type" value="vendor_update" />
                <input type="hidden" name="project_id" value={String(project.id)} />
                <select name="vendor_id" required className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
                  {vendors.map((vendor) => <option key={String(vendor.id)} value={String(vendor.id)}>{String(vendor.vendor_name)} - {String(vendor.item)}</option>)}
                </select>
                <select name="status" className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
                  {vendorStatuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
                </select>
                <Textarea name="note" placeholder="Update note" required />
                <Button disabled={vendors.length === 0}>Add update</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
