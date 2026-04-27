import { ModulePage } from "@/components/module-page";
import { moduleConfigs } from "@/lib/module-config";

export default function VendorsPage() {
  return <ModulePage config={moduleConfigs.vendors} />;
}
