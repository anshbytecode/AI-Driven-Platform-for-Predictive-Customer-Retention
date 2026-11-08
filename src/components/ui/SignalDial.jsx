import { COLOR } from "../../constants/theme";

export default function SignalDial({ value, size=56, label, dark=false }) {
  const r=size/2-6, cx=size/2, cy=size/2;
  const startAngle=-210, endAngle=30, sweep=endAngle-startAngle;
  const angle=startAngle+(value/100)*sweep;
  const tone=value>=65?COLOR.risk:value>=35?COLOR.mid:COLOR.stable;
  const polar=(deg,radius)=>{const rad=deg*Math.PI/180;return[cx+radius*Math.cos(rad),cy+radius*Math.sin(rad)]};
  const ticks=Array.from({length:11}).map((_,i)=>{
    const deg=startAngle+(sweep*i)/10;
    const [x1,y1]=polar(deg,r),[x2,y2]=polar(deg,r-(i%5===0?6:3));
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={dark?COLOR.brassLight:COLOR.brass} strokeWidth={i%5===0?1.4:.8} opacity={.8}/>;
  });
  const [nx,ny]=polar(angle,r-8);
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark?COLOR.hairDark:COLOR.hair} strokeWidth={1}/>
      {ticks}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={tone} strokeWidth={2} strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={2.6} fill={tone}/>
      <text x={cx} y={cy+r+13} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="11" fontWeight="600" fill={dark?"#EDE7DA":COLOR.ink}>{Math.round(value)}</text>
    </svg>
    {label && <div style={{fontFamily:"IBM Plex Sans",fontSize:10,letterSpacing:".04em",color:dark?"#9AA6B8":COLOR.inkSoft,textTransform:"uppercase",textAlign:"center"}}>{label}</div>}
  </div>;
}
