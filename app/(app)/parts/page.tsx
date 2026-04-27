import { ModulePage } from "@/components/module-page";
import { moduleConfigs } from "@/lib/module-config";

export default function PartsPage() {
  return <ModulePage config={moduleConfigs.parts} />;
}
