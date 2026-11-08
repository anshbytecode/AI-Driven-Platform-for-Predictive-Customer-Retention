import { Check,ChevronRight } from "lucide-react";
import { COLOR } from "../../constants/theme";
import { fmtINR } from "../../utils/helpers";
import SignalDial from "../ui/SignalDial";
import Sparkline from "../ui/Sparkline";
import Tag from "../ui/Tag";

export default function LedgerRow({c,i,onOpen,selected,onToggleSelect,queued}) {
  const tone=c.segment==="high"?"risk":c.segment==="medium"?"mid":"stable";
  return <div className="ledger-row" style={{display:"grid",gridTemplateColumns:"22px 24px 2fr 1fr 96px 80px 84px 1.2fr 1.3fr 20px",alignItems:"center",gap:10,padding:"12px 10px",borderTop:`1px solid ${COLOR.hair}`}}>
    <input type="checkbox" checked={selected} onChange={()=>onToggleSelect(c.id)}/>
    <div onClick={()=>onOpen(c)}>{String(i+1).padStart(2,"0")}</div>
    <div onClick={()=>onOpen(c)}><div style={{fontWeight:500}}>{c.name} {queued&&<Check size={12} color={COLOR.stable}/>}</div><div style={{fontSize:10.5,color:COLOR.inkSoft}}>{c.id} · {c.tenure}</div></div>
    <div onClick={()=>onOpen(c)} style={{fontSize:12,color:COLOR.inkSoft}}>{c.tier}</div>
    <div onClick={()=>onOpen(c)} style={{fontFamily:"IBM Plex Mono",fontSize:12}}>{fmtINR(c.balance)}</div>
    <div onClick={()=>onOpen(c)}><SignalDial value={c.risk} size={44}/></div>
    <div onClick={()=>onOpen(c)}><Sparkline points={c.trend} tone={tone}/></div>
    <div onClick={()=>onOpen(c)}><Tag tone={tone}>{c.driver}</Tag></div>
    <div onClick={()=>onOpen(c)} style={{fontSize:12}}>{c.action}</div>
    <ChevronRight onClick={()=>onOpen(c)} size={15}/>
  </div>;
}
