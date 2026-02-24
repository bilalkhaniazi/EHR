"use client";
import React from "react";
import { startOfDay, isAfter } from "date-fns";
import styles from "../../../styles/details.module.css";

type CaseItem = {
  id: string;
  name: string;
  assignedDate: string;
  status: string;
};

export default function AssignedCasesList({ cases }: { cases: CaseItem[] }) {
  const now = new Date();
  const todayStart = startOfDay(now);

  return (
    <div className="space-y-3">
      {cases.map((c) => {
        const assigned = new Date(c.assignedDate);
        const assignedStart = startOfDay(assigned);
        const isAssignedOnOrBeforeToday = !isAfter(assignedStart, todayStart);
        const isAssignedInFuture = isAfter(assignedStart, todayStart);

        const actions = isAssignedOnOrBeforeToday ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = "/simulation/123/chart/overview";
            }}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md text-sm"
            aria-label={`Start simulation for ${c.name}`}
          >
            Start Simulation
          </button>
        ) : isAssignedInFuture ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/simulation/123/chart/overview`;
            }}
            className="mt-2 px-3 py-1 bg-gray-100 text-sm rounded-md"
            aria-label={`View case report for ${c.name}`}
          >
            Case Report
          </button>
        ) : null;

        return (
          <details key={c.id} className={`${styles.customDetails} bg-white rounded-lg shadow-sm`}>
              <summary className={`cursor-pointer px-4 py-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : c.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {c.status}
                    </span>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-muted-foreground">Assigned: {new Date(c.assignedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={styles.arrow} aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </summary>

            <div className={`p-4 ${styles.panel}`}>
              <div className="flex flex-col items-start gap-2">{actions}</div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
