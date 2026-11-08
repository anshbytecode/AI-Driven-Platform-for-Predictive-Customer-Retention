import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell } from "recharts";
import { COLOR } from "../../constants/theme";
import { DRIVERS } from "../../data/customers";
import { toneColor } from "../../utils/helpers";

export default function DriverChart() {
  return <div style={{background:"#fff",border:`1px solid ${COLOR.hair}`,borderRadius:8,padding:"18px 20px"}}>
    <div style={{fontFamily:"Fraunces",fontSize:15.5}}>Leading churn drivers</div>
    <div style={{fontSize:11.5,color:COLOR.inkSoft,marginBottom:14}}>Accounts flagged, by dominant signal</div>
    <ResponsiveContainer width="100%" height={220}><BarChart data={DRIVERS} layout="vertical"><CartesianGrid strokeDasharray="2 4" horizontal={false}/><XAxis type="number"/><YAxis type="category" dataKey="name" width={150}/><Tooltip/><Bar dataKey="value" radius={[0,3,3,0]} barSize={14}>{DRIVERS.map((d,i)=><Cell key={i} fill={toneColor(d.tone)}/>)}</Bar></BarChart></ResponsiveContainer>
  </div>;
}
