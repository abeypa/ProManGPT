import { ModulePage } from "@/components/module-page";
import { moduleConfigs } from "@/lib/module-config";

export default function TeamsPage() {
  return <ModulePage config={moduleConfigs.teams} />;
}
