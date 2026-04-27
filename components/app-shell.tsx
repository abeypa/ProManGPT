import Link from "next/link";
import { Bell, Boxes, Building2, ClipboardList, FileText, LayoutDashboard, MessageSquare, PackageSearch, Settings, Shield, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roleLabels } from "@/lib/constants";
import type { Profile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Building2 },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/discussions", label: "Discussions", icon: MessageSquare },
  { href: "/parts", label: "Parts / BOM", icon: PackageSearch },
  { href: "/vendors", label: "Vendors", icon: Truck },
  { href: "/files", label: "Files", icon: FileText },
  { href: "/settings/users", label: "Users", icon: Settings },
  { href: "/settings/roles", label: "Roles", icon: Shield }
];

export async function AppShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .is("read_at", null);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">EngFlow</p>
            <p className="text-xs text-muted-foreground">Project Operations</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur lg:px-6">
          <div>
            <p className="text-sm font-semibold">{profile.full_name}</p>
            <p className="text-xs text-muted-foreground">{roleLabels[profile.role]}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
              {count ?? 0}
            </Button>
            <Badge value={profile.status} />
            <SignOutButton />
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
