import { FileUploadForm } from "@/components/file-upload-form";
import { ModuleTable } from "@/components/module-table";
import { PageHeading } from "@/components/page-heading";
import { moduleConfigs } from "@/lib/module-config";
import { createClient } from "@/lib/supabase/server";

export default async function FilesPage() {
  const supabase = await createClient();
  const [files, projects] = await Promise.all([
    supabase.from("files").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("id,name").order("name")
  ]);
  if (files.error) throw new Error(files.error.message);

  return (
    <>
      <PageHeading title="Files" description="Upload and browse project files stored in Supabase Storage." />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ModuleTable config={moduleConfigs.files} rows={(files.data ?? []) as Record<string, unknown>[]} />
        <FileUploadForm projects={projects.data ?? []} />
      </div>
    </>
  );
}
