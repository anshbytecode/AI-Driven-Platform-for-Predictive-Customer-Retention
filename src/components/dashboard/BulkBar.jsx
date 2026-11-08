import { COLOR } from "../../constants/theme";

export default function BulkBar({count,onQueue,onClear,onSelectVisible,onClearQueued,hasVisible}) {
  if(!count) return null;
  return <div style={{position:"sticky",bottom:14,marginTop:14,zIndex:10,display:"flex",alignItems:"center",gap:14,padding:"10px 16px",background:COLOR.ink,borderRadius:8,boxShadow:"0 10px 24px rgba(18,26,38,.25)",width:"fit-content",flexWrap:"wrap"}}>
    <span style={{color:"#F3F1E9",fontSize:12.5}}>{count} selected</span>
    <button onClick={onQueue} style={btn(COLOR.brass)}>Queue outreach</button>
    <button onClick={onClear} style={btn("transparent","#9AA6B8")}>Clear selected</button>
    {hasVisible&&<button onClick={onSelectVisible} style={btn("transparent","#9AA6B8")}>Select visible</button>}
    <button onClick={onClearQueued} style={btn("transparent","#9AA6B8")}>Clear queue</button>
  </div>;
}
const btn=(background,color="#fff")=>({fontSize:12,fontWeight:600,background,color,border:"none",borderRadius:6,padding:"7px 14px",cursor:"pointer"});
