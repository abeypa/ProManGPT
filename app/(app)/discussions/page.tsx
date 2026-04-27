import { ModulePage } from "@/components/module-page";
import { moduleConfigs } from "@/lib/module-config";

export default function DiscussionsPage() {
  return <ModulePage config={moduleConfigs.discussions} />;
}
