import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Activity } from "lucide-react";
import Card from "./Card.jsx";

function colorFor(value) {
  if (value >= 80) return "#3ED598";
  if (value >= 60) return "#45E0D5";
  return "#F0616B";
}

export default function MetricsChart({ metrics }) {
  if (!metrics) return null;
  const data = Object.entries(metrics).map(([topic, value]) => ({ topic, value }));

  return (
    <Card title="Performance Metrics" icon={<Activity size={14} className="text-signal" />}>
      <div className="h-44 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="topic"
              tick={{ fill: "#8B96AB", fontSize: 11 }}
              axisLine={{ stroke: "#232C3D" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#8B96AB", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <ReferenceLine y={60} stroke="#5A6478" strokeDasharray="3 3" />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "#121826",
                border: "1px solid #232C3D",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#E7ECF3" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={colorFor(d.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-ink-faint mt-1">
        Dashed line marks the 60% target the agent monitors for.
      </p>
    </Card>
  );
}
