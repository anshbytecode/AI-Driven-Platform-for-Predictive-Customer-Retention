import { ArrowUpRight } from "lucide-react";
import { COLOR } from "../../constants/theme";
import useCountUp from "../../hooks/useCountUp";
import SignalDial from "../ui/SignalDial";

export default function HeroStats({riskIndex,avgConfidence,revenueAtRisk,flaggedCount,queuedCount,total}) {
  const flagged=useCountUp(flaggedCount), revenue=useCountUp(revenueAtRisk);
  return <div style={{padding:"26px 28px 8px",display:"flex",gap:28,flexWrap:"wrap",alignItems:"flex-end",background:COLOR.paperRaised,borderBottom:`1px solid ${COLOR.hair}`}}>
    <div><div style={{fontFamily:"Fraunces",fontSize:15,fontStyle:"italic",color:COLOR.inkSoft}}>This quarter's signal</div><div style={{fontFamily:"Fraunces",fontSize:40,fontWeight:500}}>{Math.round(flagged)}<span style={{fontSize:18,color:COLOR.inkSoft,fontFamily:"IBM Plex Sans",fontWeight:400}}> of {total} sample accounts at elevated churn risk</span></div><div style={{fontSize:12.5,color:COLOR.inkSoft,marginTop:8,display:"flex",gap:4}}><ArrowUpRight size={13} color={COLOR.risk}/> recalculates live as you move the sensitivity thresholds</div></div>
    <div style={{display:"flex",gap:26,marginLeft:"auto",padding:"10px 22px",background:"#fff",borderRadius:8,border:`1px solid ${COLOR.hair}`}}><SignalDial value={riskIndex} label="Risk Index"/><SignalDial value={avgConfidence} label="Model Confidence"/><div style={{padding:"8px"}}><div style={{fontFamily:"IBM Plex Mono",fontSize:22,color:COLOR.risk}}>₹{revenue.toFixed(1)}L</div><div style={{fontSize:10,color:COLOR.inkSoft}}>Revenue at Risk</div></div></div>
    <div style={{display:"flex",gap:10}}><div style={statStyle}><small>Queued</small><b>{queuedCount}</b></div><div style={statStyle}><small>Confidence</small><b>{avgConfidence}%</b></div></div>
  </div>;
}
const statStyle={background:"#fff",border:"1px solid #D8D9CE",borderRadius:8,padding:"10px 12px",minWidth:100,display:"flex",flexDirection:"column"};
