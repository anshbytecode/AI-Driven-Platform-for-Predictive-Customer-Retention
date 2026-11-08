import { toneColor } from "../../utils/helpers";

export default function Sparkline({ points, tone }) {
  const w=64,h=24,max=Math.max(...points),min=Math.min(...points);
  const norm=v=>h-((v-min)/(max-min||1))*(h-4)-2;
  const step=w/(points.length-1);
  const d=points.map((p,i)=>`${i===0?"M":"L"} ${i*step} ${norm(p)}`).join(" ");
  const color=toneColor(tone);
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
    <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx={w} cy={norm(points[points.length-1])} r={2} fill={color}/>
  </svg>;
}
