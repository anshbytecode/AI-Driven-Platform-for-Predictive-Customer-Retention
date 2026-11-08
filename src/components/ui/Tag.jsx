import { COLOR } from "../../constants/theme";

export default function Tag({ children, tone="neutral" }) {
  const map = {
    risk:{bg:COLOR.riskSoft,fg:"#7A2A24"},
    mid:{bg:COLOR.midSoft,fg:"#6B5220"},
    stable:{bg:COLOR.stableSoft,fg:"#2C4A39"},
    neutral:{bg:"#E4E4DA",fg:COLOR.inkSoft},
  };
  const c = map[tone];
  return <span style={{background:c.bg,color:c.fg,fontFamily:"IBM Plex Sans",fontSize:11,fontWeight:500,padding:"3px 8px",borderRadius:3,whiteSpace:"nowrap"}}>{children}</span>;
}
