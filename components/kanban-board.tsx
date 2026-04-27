import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { workStatuses } from "@/lib/constants";
import { formatDate, titleCase } from "@/lib/utils";

export function KanbanBoard({ tasks }: { tasks: Record<string, unknown>[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      {workStatuses.map((status) => {
        const items = tasks.filter((task) => task.status === status);
        return (
          <Card key={status}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                {titleCase(status)}
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 ? <p className="text-xs text-muted-foreground">No tasks</p> : null}
              {items.map((task) => (
                <div key={String(task.id)} className="rounded-md border bg-white p-3">
                  <p className="text-sm font-medium">{String(task.title)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge value={String(task.priority ?? "medium")} />
                    <span className="text-xs text-muted-foreground">{formatDate(task.due_date as string | null)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
