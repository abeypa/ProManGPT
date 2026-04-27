import { cn, titleCase } from "@/lib/utils";

const tones: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  delayed: "border-red-200 bg-red-50 text-red-700",
  blocked: "border-red-200 bg-red-50 text-red-700",
  waiting: "border-amber-200 bg-amber-50 text-amber-700",
  under_review: "border-sky-200 bg-sky-50 text-sky-700",
  default: "border-slate-200 bg-slate-50 text-slate-700"
};

export function Badge({ value, className }: { value: string | null | undefined; className?: string }) {
  const key = value ?? "default";
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[key] ?? tones.default, className)}>
      {titleCase(key)}
    </span>
  );
}
