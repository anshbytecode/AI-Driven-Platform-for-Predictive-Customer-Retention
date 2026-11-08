import { AlertTriangle } from "lucide-react";
import { COLOR } from "../../constants/theme";
import Button from "./Button";

export default function EmptyState({title,subtitle,actionLabel,onAction,icon:Icon=AlertTriangle}) {
  return <div style={{background:"#fff",border:`1px dashed ${COLOR.hair}`,borderRadius:10,padding:28,textAlign:"center"}}>
    <Icon size={20} color={COLOR.brass}/>
    <div style={{fontFamily:"Fraunces",fontSize:18,marginTop:10,color:COLOR.ink}}>{title}</div>
    <div style={{fontFamily:"IBM Plex Sans",fontSize:12.5,color:COLOR.inkSoft,marginTop:6}}>{subtitle}</div>
    {actionLabel && <div style={{marginTop:14}}><Button onClick={onAction} filled>{actionLabel}</Button></div>}
  </div>;
}
