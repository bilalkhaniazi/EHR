"use client";
import React from "react";
import { format } from "date-fns";

type Props = {
  id: string;
  name: string;
  assignedDate: string;
  status: string;
  onClick?: () => void;
  actions?: React.ReactNode;
  showDate?: boolean;
};

export default function CaseCard({ id, name, assignedDate, status, onClick, actions, showDate = true }: Props) {
  const assigned = new Date(assignedDate);
  return (
    <div
      {...(onClick ? { role: "button", onClick } : {})}
      className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm ${onClick ? "hover:shadow-md cursor-pointer" : ""}`}
    >
      <div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              status === "Completed"
                ? "bg-green-100 text-green-800"
                : status === "In Progress"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {status}
          </span>
          <div className="font-medium">{name}</div>
        </div>
        {showDate ? <div className="text-sm text-muted-foreground">Assigned: {format(assigned, "PPP")}</div> : null}
        {/* actions slot appears below the assigned date (e.g., buttons) */}
        {actions ? <div className="mt-3">{actions}</div> : null}
      </div>

      <div className="text-sm text-slate-400">{id}</div>
    </div>
  );
}
