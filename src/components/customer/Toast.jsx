import { Check } from "lucide-react";
import { COLOR } from "../../constants/theme";

export default function Toast({message}) {
  if(!message) return null;
  return <div style={{position:"fixed",bottom:24,right:24,background:COLOR.ink,color:"#F3F1E9",padding:"11px 18px",borderRadius:7,zIndex:60,display:"flex",alignItems:"center",gap:8}}><Check size={14} color={COLOR.brassLight}/>{message}</div>;
}
