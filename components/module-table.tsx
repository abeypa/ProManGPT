import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import type { ModuleConfig } from "@/lib/module-config";
import { formatDate, titleCase } from "@/lib/utils";

function renderValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === "") return <span className="text-muted-foreground">Not set</span>;
  if (key.includes("date") || key === "created_at") return formatDate(String(value));
  if (["status", "priority", "approval_status", "category"].includes(key)) return <Badge value={String(value)} />;
  if (typeof value === "number") return value.toLocaleString("en-IN");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function ModuleTable({ config, rows }: { config: ModuleConfig; rows: Record<string, unknown>[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState title={`No ${config.title.toLowerCase()} yet`} description="Create the first record using the form on this page." />
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <thead>
                <tr>{config.columns.map((column) => <Th key={column}>{titleCase(column)}</Th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)} className="bg-white">
                    {config.columns.map((column, index) => (
                      <Td key={column}>
                        {config.key === "projects" && index === 0 ? (
                          <Link className="font-medium text-primary hover:underline" href={`/projects/${row.id}`}>
                            {renderValue(column, row[column])}
                          </Link>
                        ) : (
                          renderValue(column, row[column])
                        )}
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
