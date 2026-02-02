"use client";
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type AssignedProps = {
  variant: "assigned";
  progress?: number; // 0-100
};

type CompletedProps = {
  variant: "completed";
  score: number;
  accuracy: number;
  timeTakenMinutes: number;
};

type Props = AssignedProps | CompletedProps;

const COLORS = ["#60A5FA", "#E5E7EB"]; // blue and gray

export default function ReviewChart(props: Props) {
  if (props.variant === "assigned") {
    const progress = props.progress ?? 10;
    const data = [
      { name: "progress", value: progress },
      { name: "remaining", value: 100 - progress },
    ];

    return (
      <div className="w-40 h-40">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={55}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2 text-sm">Preview</div>
      </div>
    );
  }

  // completed
  const data = [
    { name: "Score", value: props.score },
    { name: "Accuracy", value: props.accuracy },
  ];

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ left: 20 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#34D399" />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-sm text-muted-foreground mt-2">Time: {props.timeTakenMinutes} min</div>
    </div>
  );
}
