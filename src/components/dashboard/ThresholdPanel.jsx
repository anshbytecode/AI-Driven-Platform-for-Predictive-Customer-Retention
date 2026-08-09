import { COLOR } from "../../constants/theme";

export default function ThresholdPanel({thresholds,setThresholds,onReset}) {
  return <div style={{display:"flex",gap:28,padding:"14px 18px",background:"#fff",border:`1px solid ${COLOR.hair}`,borderRadius:8,marginTop:10,flexWrap:"wrap"}}>
    <label style={{flex:"1 1 220px",fontSize:11.5}}>Flag high risk above <b>{thresholds.high}</b><input type="range" min={thresholds.mid+5} max={95} value={thresholds.high} onChange={e=>setThresholds(t=>({...t,high:Number(e.target.value)}))} style={{width:"100%",accentColor:COLOR.risk}}/></label>
    <label style={{flex:"1 1 220px",fontSize:11.5}}>Flag watch above <b>{thresholds.mid}</b><input type="range" min={5} max={thresholds.high-5} value={thresholds.mid} onChange={e=>setThresholds(t=>({...t,mid:Number(e.target.value)}))} style={{width:"100%",accentColor:COLOR.mid}}/></label>
    <button onClick={onReset} style={{border:`1px solid ${COLOR.hair}`,background:"transparent",borderRadius:6,padding:"0 14px"}}>Reset defaults</button>
  </div>;
}
