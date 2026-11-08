import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function SortHeader({label,active,dir,onClick,style}) {
  return <div onClick={onClick} style={{...style,cursor:onClick?"pointer":"default",display:"flex",alignItems:"center",gap:3,userSelect:"none"}}>
    {label}
    {onClick && (active ? (dir==="asc"?<ArrowUp size={11}/>:<ArrowDown size={11}/>) : <ArrowUpDown size={10} style={{opacity:.35}}/>)}
  </div>;
}
