import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";

export default async function UsersSettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("id,full_name,role,status,team_id,created_at").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <>
      <PageHeading title="Users" description="Manage profile visibility, roles, team assignment, and status." />
      <Card>
        <CardHeader><CardTitle>User profiles</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <thead><tr><Th>Name</Th><Th>Role</Th><Th>Status</Th><Th>Team</Th></tr></thead>
              <tbody>
                {(data ?? []).map((profile) => (
                  <tr key={profile.id} className="bg-white">
                    <Td>{profile.full_name ?? "Unnamed user"}</Td>
                    <Td><Badge value={profile.role} /></Td>
                    <Td><Badge value={profile.status} /></Td>
                    <Td>{profile.team_id ?? "Not assigned"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
