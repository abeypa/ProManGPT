import { ModulePage } from "@/components/module-page";
import { moduleConfigs } from "@/lib/module-config";

export default function ProjectsPage() {
  return <ModulePage config={moduleConfigs.projects} />;
}
