import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Activity } from "lucide-react";
import Card from "./Card.jsx";

function colorFor(value, target) {
  if (value >= 80) return "#3ED598";
  if (value >= target) return "#45E0D5";
  return "#F0616B";
}

export default function MetricsChart({ metrics, target = 60 }) {
  if (!metrics) return null;
  const data = Object.entries(metrics).map(([topic, value]) => ({ topic, value }));

  return (
    <Card title="Performance Metrics" icon={<Activity size={14} className="text-signal" />}>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-[11px] text-ink-muted">
        {data.map((item) => (
          <span key={item.topic}><strong className="text-ink">{item.topic}</strong> {item.value}%</span>
        ))}
        <span><strong className="text-amber">Target</strong> {target}%</span>
      </div>
      <div className="h-48 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 8, bottom: 4, left: 0 }}>
            <XAxis dataKey="topic" tick={{ fill: "#8B96AB", fontSize: 11 }} axisLine={{ stroke: "#232C3D" }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#8B96AB", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <ReferenceLine y={target} stroke="#F2B84B" strokeDasharray="5 4" label={{ value: `Target ${target}%`, position: "insideTopRight", fill: "#F2B84B", fontSize: 10 }} />
            <Tooltip
              formatter={(value) => [`${value}%`, "Performance"]}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{ background: "#121826", border: "1px solid #232C3D", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#E7ECF3" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((item) => <Cell key={item.topic} fill={colorFor(item.value, target)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-ink-faint mt-1">Machine Learning is below target, which triggers the scripted Observe → Adapt demonstration.</p>
    </Card>
  );
}
