import { RefreshCw,Plus,Settings } from "lucide-react";
import Button from "../ui/Button";

export default function QuickActions({onRefresh,onSeedQueue}) {
  return <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12}}>
    <Button onClick={onRefresh} icon={RefreshCw}>Refresh data</Button>
    <Button onClick={onSeedQueue} icon={Plus}>Seed queue</Button>
    <Button onClick={()=>alert("Settings panel can be added next")} icon={Settings}>Settings</Button>
  </div>;
}
