import { COLOR } from "../../constants/theme";

export default function Button({ children, onClick, filled=false, tone="dark", icon: Icon }) {
  const styles = filled
    ? { background:tone==="dark" ? COLOR.ink : COLOR.brass, color:"#fff", border:"none" }
    : { background:"transparent", color:COLOR.inkSoft, border:`1px solid ${COLOR.hair}` };

  return <button onClick={onClick} style={{...styles,borderRadius:8,padding:"10px 14px",cursor:"pointer",fontFamily:"IBM Plex Sans",fontSize:12.5,fontWeight:600,display:"inline-flex",alignItems:"center",gap:8}}>
    {Icon && <Icon size={14}/>}
    {children}
  </button>;
}
