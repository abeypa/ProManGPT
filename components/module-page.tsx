import { ModuleForm } from "@/components/module-form";
import { ModuleTable } from "@/components/module-table";
import { PageHeading } from "@/components/page-heading";
import { createClient } from "@/lib/supabase/server";
import type { ModuleConfig } from "@/lib/module-config";

export async function ModulePage({ config }: { config: ModuleConfig }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .order(config.orderBy ?? "created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  return (
    <>
      <PageHeading title={config.title} description={config.description} />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ModuleTable config={config} rows={(data ?? []) as Record<string, unknown>[]} />
        <ModuleForm config={config} />
      </div>
    </>
  );
}
