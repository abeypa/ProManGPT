export const roleLabels = {
  admin: "Admin",
  project_manager: "Project Manager",
  team_lead: "Team Lead",
  team_member: "Team Member"
} as const;

export const defaultDepartments = [
  "Mechanical Design",
  "EE Design",
  "Purchase",
  "Software",
  "Installation",
  "Planning",
  "Production",
  "QA/QC"
] as const;

export const priorities = ["low", "medium", "high", "critical"] as const;

export const projectStatuses = ["planning", "active", "on_hold", "completed", "archived"] as const;

export const workStatuses = [
  "not_started",
  "in_progress",
  "waiting",
  "under_review",
  "completed",
  "blocked"
] as const;

export const approvalStatuses = ["suggested", "lead_review", "pm_review", "approved", "rejected"] as const;

export const vendorStatuses = [
  "quotation_requested",
  "quotation_received",
  "under_negotiation",
  "po_issued",
  "in_production",
  "dispatched",
  "delivered",
  "delayed",
  "rejected"
] as const;

export const fileCategories = [
  "cad",
  "datasheet",
  "quotation",
  "po",
  "installation_photo",
  "test_report",
  "client_document"
] as const;
