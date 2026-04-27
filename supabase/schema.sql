create extension if not exists "uuid-ossp";

create type app_role as enum ('admin','project_manager','team_lead','team_member');
create type user_status as enum ('active','inactive','invited');
create type priority_level as enum ('low','medium','high','critical');
create type project_status as enum ('planning','active','on_hold','completed','archived');
create type work_status as enum ('not_started','in_progress','waiting','under_review','completed','blocked');
create type approval_status as enum ('suggested','lead_review','pm_review','approved','rejected','pending');
create type vendor_status as enum ('quotation_requested','quotation_received','under_negotiation','po_issued','in_production','dispatched','delivered','delayed','rejected');
create type file_category as enum ('cad','datasheet','quotation','po','installation_photo','test_report','client_document');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role app_role not null default 'team_member',
  status user_status not null default 'active',
  team_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  department text not null,
  description text,
  lead_id uuid references profiles(id) on delete set null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles add constraint profiles_team_id_fkey foreign key (team_id) references teams(id) on delete set null;

create table team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role_in_team text default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  client text not null,
  description text,
  priority priority_level not null default 'medium',
  status project_status not null default 'planning',
  start_date date,
  due_date date,
  project_manager_id uuid references profiles(id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_teams (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (project_id, team_id)
);

create table project_stages (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  team_id uuid references teams(id) on delete set null,
  owner_id uuid references profiles(id) on delete set null,
  start_date date,
  due_date date,
  status work_status not null default 'not_started',
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  project_id uuid references projects(id) on delete cascade,
  stage_id uuid references project_stages(id) on delete set null,
  team_id uuid references teams(id) on delete set null,
  assignee_id uuid references profiles(id) on delete set null,
  created_by uuid references profiles(id) on delete set null,
  priority priority_level not null default 'medium',
  due_date date,
  status work_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table task_comments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  body text not null,
  parent_id uuid references task_comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table discussions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  category text not null,
  description text,
  created_by uuid references profiles(id) on delete set null,
  status work_status not null default 'not_started',
  is_final_decision boolean not null default false,
  final_decision text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table discussion_comments (
  id uuid primary key default uuid_generate_v4(),
  discussion_id uuid not null references discussions(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  body text not null,
  parent_id uuid references discussion_comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table parts (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  part_name text not null,
  category text not null,
  suggested_by uuid references profiles(id) on delete set null,
  vendor text,
  datasheet text,
  price numeric(12,2),
  availability text,
  lead_time text,
  notes text,
  approval_status approval_status not null default 'suggested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vendors (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  vendor_name text not null,
  item text not null,
  quotation_amount numeric(12,2),
  negotiated_amount numeric(12,2),
  delivery_date date,
  status vendor_status not null default 'quotation_requested',
  updated_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vendor_updates (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  updated_by uuid references profiles(id) on delete set null,
  status vendor_status not null,
  note text,
  created_at timestamptz not null default now()
);

create table files (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  discussion_id uuid references discussions(id) on delete cascade,
  part_id uuid references parts(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete cascade,
  uploaded_by uuid references profiles(id) on delete set null,
  file_name text not null,
  storage_path text not null,
  category file_category not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  actor_id uuid references profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table approvals (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id uuid not null,
  requested_by uuid references profiles(id) on delete set null,
  reviewer_id uuid references profiles(id) on delete set null,
  status approval_status not null default 'pending',
  note text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index on project_teams(project_id);
create index on project_teams(team_id);
create index on team_members(user_id);
create index on tasks(assignee_id, due_date);
create index on tasks(project_id);
create index on project_stages(project_id);
create index on discussions(project_id);
create index on parts(project_id);
create index on vendors(project_id);
create index on files(project_id);
create index on activity_logs(project_id, created_at desc);
create index on notifications(user_id, read_at);

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_profiles before update on profiles for each row execute function touch_updated_at();
create trigger touch_teams before update on teams for each row execute function touch_updated_at();
create trigger touch_projects before update on projects for each row execute function touch_updated_at();
create trigger touch_project_stages before update on project_stages for each row execute function touch_updated_at();
create trigger touch_tasks before update on tasks for each row execute function touch_updated_at();
create trigger touch_discussions before update on discussions for each row execute function touch_updated_at();
create trigger touch_parts before update on parts for each row execute function touch_updated_at();
create trigger touch_vendors before update on vendors for each row execute function touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role, status)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'team_member', 'active')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function current_user_role()
returns app_role language sql security definer stable set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce(current_user_role() = 'admin', false);
$$;

create or replace function is_project_manager(project_uuid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists(select 1 from projects where id = project_uuid and project_manager_id = auth.uid());
$$;

create or replace function can_access_project(project_uuid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select is_admin()
    or exists(select 1 from projects where id = project_uuid and project_manager_id = auth.uid())
    or exists(
      select 1
      from project_teams pt
      join team_members tm on tm.team_id = pt.team_id
      where pt.project_id = project_uuid and tm.user_id = auth.uid()
    )
    or exists(select 1 from tasks where project_id = project_uuid and assignee_id = auth.uid());
$$;

alter table profiles enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table projects enable row level security;
alter table project_teams enable row level security;
alter table project_stages enable row level security;
alter table tasks enable row level security;
alter table task_comments enable row level security;
alter table discussions enable row level security;
alter table discussion_comments enable row level security;
alter table parts enable row level security;
alter table vendors enable row level security;
alter table vendor_updates enable row level security;
alter table files enable row level security;
alter table notifications enable row level security;
alter table activity_logs enable row level security;
alter table approvals enable row level security;

create policy profiles_read on profiles for select using (id = auth.uid() or is_admin());
create policy profiles_update_self on profiles for update using (id = auth.uid() or is_admin());
create policy profiles_admin_insert on profiles for insert with check (is_admin());

create policy teams_read on teams for select using (is_admin() or exists(select 1 from team_members tm where tm.team_id = id and tm.user_id = auth.uid()));
create policy teams_manage on teams for all using (is_admin() or lead_id = auth.uid()) with check (is_admin() or lead_id = auth.uid() or created_by = auth.uid());

create policy team_members_read on team_members for select using (is_admin() or user_id = auth.uid() or exists(select 1 from teams t where t.id = team_id and t.lead_id = auth.uid()));
create policy team_members_manage on team_members for all using (is_admin() or exists(select 1 from teams t where t.id = team_id and t.lead_id = auth.uid())) with check (is_admin() or exists(select 1 from teams t where t.id = team_id and t.lead_id = auth.uid()));

create policy projects_read on projects for select using (can_access_project(id));
create policy projects_insert on projects for insert with check (is_admin() or current_user_role() = 'project_manager');
create policy projects_update on projects for update using (is_admin() or project_manager_id = auth.uid()) with check (is_admin() or project_manager_id = auth.uid());

create policy project_teams_access on project_teams for select using (can_access_project(project_id));
create policy project_teams_manage on project_teams for all using (is_admin() or is_project_manager(project_id)) with check (is_admin() or is_project_manager(project_id));

create policy stages_access on project_stages for select using (can_access_project(project_id));
create policy stages_manage on project_stages for all using (is_admin() or is_project_manager(project_id) or owner_id = auth.uid() or exists(select 1 from teams t where t.id = team_id and t.lead_id = auth.uid())) with check (is_admin() or is_project_manager(project_id) or owner_id = auth.uid() or exists(select 1 from teams t where t.id = team_id and t.lead_id = auth.uid()));

create policy tasks_access on tasks for select using (can_access_project(project_id) or assignee_id = auth.uid());
create policy tasks_manage on tasks for all using (is_admin() or assignee_id = auth.uid() or is_project_manager(project_id) or exists(select 1 from teams t where t.id = team_id and t.lead_id = auth.uid())) with check (is_admin() or is_project_manager(project_id) or exists(select 1 from teams t where t.id = team_id and t.lead_id = auth.uid()) or assignee_id = auth.uid());

create policy task_comments_access on task_comments for select using (exists(select 1 from tasks t where t.id = task_id and (can_access_project(t.project_id) or t.assignee_id = auth.uid())));
create policy task_comments_insert on task_comments for insert with check (author_id = auth.uid());

create policy discussions_access on discussions for select using (can_access_project(project_id));
create policy discussions_manage on discussions for all using (is_admin() or created_by = auth.uid() or is_project_manager(project_id)) with check (is_admin() or created_by = auth.uid() or is_project_manager(project_id));

create policy discussion_comments_access on discussion_comments for select using (exists(select 1 from discussions d where d.id = discussion_id and can_access_project(d.project_id)));
create policy discussion_comments_insert on discussion_comments for insert with check (author_id = auth.uid());

create policy parts_access on parts for select using (can_access_project(project_id) or suggested_by = auth.uid());
create policy parts_manage on parts for all using (is_admin() or suggested_by = auth.uid() or is_project_manager(project_id)) with check (is_admin() or suggested_by = auth.uid() or is_project_manager(project_id));

create policy vendors_access on vendors for select using (can_access_project(project_id));
create policy vendors_manage on vendors for all using (is_admin() or is_project_manager(project_id) or current_user_role() in ('project_manager','team_lead')) with check (is_admin() or is_project_manager(project_id) or current_user_role() in ('project_manager','team_lead'));

create policy vendor_updates_access on vendor_updates for select using (exists(select 1 from vendors v where v.id = vendor_id and can_access_project(v.project_id)));
create policy vendor_updates_insert on vendor_updates for insert with check (updated_by = auth.uid());

create policy files_access on files for select using (can_access_project(project_id) or uploaded_by = auth.uid());
create policy files_insert on files for insert with check (uploaded_by = auth.uid() and (project_id is null or can_access_project(project_id)));

create policy notifications_self on notifications for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid() or is_admin());
create policy activity_read on activity_logs for select using (project_id is null or can_access_project(project_id) or is_admin());
create policy activity_insert on activity_logs for insert with check (actor_id = auth.uid() or is_admin());
create policy approvals_read on approvals for select using (is_admin() or requested_by = auth.uid() or reviewer_id = auth.uid());
create policy approvals_manage on approvals for all using (is_admin() or reviewer_id = auth.uid() or requested_by = auth.uid()) with check (is_admin() or requested_by = auth.uid() or reviewer_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

create policy storage_project_files_read on storage.objects for select
using (bucket_id = 'project-files' and auth.role() = 'authenticated');

create policy storage_project_files_write on storage.objects for insert
with check (bucket_id = 'project-files' and auth.role() = 'authenticated');
