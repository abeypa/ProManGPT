import { z } from "zod";
import {
  approvalStatuses,
  defaultDepartments,
  fileCategories,
  priorities,
  projectStatuses,
  vendorStatuses,
  workStatuses
} from "@/lib/constants";

export type FieldType = "text" | "textarea" | "date" | "number" | "select";

export type ModuleField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
};

export type ModuleConfig = {
  key: string;
  title: string;
  description: string;
  table: string;
  href: string;
  createLabel: string;
  fields: ModuleField[];
  columns: string[];
  orderBy?: string;
};

export const moduleConfigs = {
  projects: {
    key: "projects",
    title: "Projects",
    description: "Manage engineering projects, assigned teams, status, priority, and delivery dates.",
    table: "projects",
    href: "/projects",
    createLabel: "Create project",
    orderBy: "created_at",
    columns: ["name", "client", "priority", "status", "start_date", "due_date"],
    fields: [
      { name: "name", label: "Project name", type: "text", required: true },
      { name: "client", label: "Client", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "priority", label: "Priority", type: "select", options: priorities, required: true },
      { name: "status", label: "Status", type: "select", options: projectStatuses, required: true },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "due_date", label: "Due date", type: "date" }
    ]
  },
  teams: {
    key: "teams",
    title: "Teams",
    description: "Organize departments, team leads, members, active projects, and workload.",
    table: "teams",
    href: "/teams",
    createLabel: "Create team",
    columns: ["name", "department", "description"],
    fields: [
      { name: "name", label: "Team name", type: "text", required: true },
      { name: "department", label: "Department", type: "select", options: defaultDepartments, required: true },
      { name: "description", label: "Description", type: "textarea" }
    ]
  },
  tasks: {
    key: "tasks",
    title: "Tasks",
    description: "Track assigned work in list and Kanban-style status groups.",
    table: "tasks",
    href: "/tasks",
    createLabel: "Create task",
    columns: ["title", "priority", "status", "due_date"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "priority", label: "Priority", type: "select", options: priorities, required: true },
      { name: "status", label: "Status", type: "select", options: workStatuses, required: true },
      { name: "due_date", label: "Due date", type: "date" }
    ]
  },
  discussions: {
    key: "discussions",
    title: "Discussions",
    description: "Capture design ideas, reviews, technical decisions, and final outcomes.",
    table: "discussions",
    href: "/discussions",
    createLabel: "Start discussion",
    columns: ["title", "category", "status", "is_final_decision"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: workStatuses, required: true }
    ]
  },
  parts: {
    key: "parts",
    title: "Parts / BOM",
    description: "Suggest, review, and approve project parts with vendor and lead-time details.",
    table: "parts",
    href: "/parts",
    createLabel: "Suggest part",
    columns: ["part_name", "category", "vendor", "price", "availability", "approval_status"],
    fields: [
      { name: "part_name", label: "Part name", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "vendor", label: "Vendor", type: "text" },
      { name: "datasheet", label: "Datasheet URL", type: "text" },
      { name: "price", label: "Price", type: "number" },
      { name: "availability", label: "Availability", type: "text" },
      { name: "lead_time", label: "Lead time", type: "text" },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "approval_status", label: "Approval status", type: "select", options: approvalStatuses, required: true }
    ]
  },
  vendors: {
    key: "vendors",
    title: "Vendors",
    description: "Track purchase quotations, negotiations, delivery dates, and vendor status updates.",
    table: "vendors",
    href: "/vendors",
    createLabel: "Add vendor item",
    columns: ["vendor_name", "item", "quotation_amount", "negotiated_amount", "delivery_date", "status"],
    fields: [
      { name: "vendor_name", label: "Vendor name", type: "text", required: true },
      { name: "item", label: "Item", type: "text", required: true },
      { name: "quotation_amount", label: "Quotation amount", type: "number" },
      { name: "negotiated_amount", label: "Negotiated amount", type: "number" },
      { name: "delivery_date", label: "Delivery date", type: "date" },
      { name: "status", label: "Status", type: "select", options: vendorStatuses, required: true }
    ]
  },
  files: {
    key: "files",
    title: "Files",
    description: "Browse uploaded CAD, datasheets, quotations, POs, photos, reports, and client documents.",
    table: "files",
    href: "/files",
    createLabel: "Register file",
    columns: ["file_name", "category", "mime_type", "file_size"],
    fields: [
      { name: "file_name", label: "File name", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: fileCategories, required: true },
      { name: "storage_path", label: "Storage path", type: "text", required: true },
      { name: "mime_type", label: "MIME type", type: "text" },
      { name: "file_size", label: "File size", type: "number" }
    ]
  }
} satisfies Record<string, ModuleConfig>;

export function schemaFor(config: ModuleConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};
  config.fields.forEach((field) => {
    if (field.type === "number") {
      shape[field.name] = z.preprocess(
        (value) => (value === "" ? null : value),
        z.coerce.number().nullable().optional()
      );
      return;
    }

    const stringSchema = z.string().trim();
    shape[field.name] = field.required
      ? stringSchema.min(1, `${field.label} is required`)
      : stringSchema.optional().or(z.literal(""));
  });
  return z.object(shape).passthrough();
}
