"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fileCategories } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { titleCase } from "@/lib/utils";

export function FileUploadForm({ projects }: { projects: { id: string; name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    const projectId = String(form.get("project_id"));
    const category = String(form.get("category"));

    if (!(file instanceof File) || file.size === 0) {
      setError("Select a file to upload.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const storagePath = `${projectId}/${crypto.randomUUID()}-${file.name}`;
    const upload = await supabase.storage.from("project-files").upload(storagePath, file, { upsert: false });
    if (upload.error) {
      setError(upload.error.message);
      setLoading(false);
      return;
    }

    const insert = await supabase.from("files").insert({
      project_id: projectId,
      uploaded_by: user.user?.id,
      file_name: file.name,
      storage_path: storagePath,
      category,
      mime_type: file.type,
      file_size: file.size
    });

    setLoading(false);
    if (insert.error) {
      setError(insert.error.message);
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload file</CardTitle>
        <CardDescription>Uploads the object to Supabase Storage and records metadata in the files table.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium">
            Project
            <select name="project_id" required className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
              <option value="">Select project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Category
            <select name="category" required className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
              {fileCategories.map((category) => <option key={category} value={category}>{titleCase(category)}</option>)}
            </select>
          </label>
          <input name="file" type="file" required className="block w-full text-sm" />
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          <Button disabled={loading}>{loading ? "Uploading..." : "Upload file"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
