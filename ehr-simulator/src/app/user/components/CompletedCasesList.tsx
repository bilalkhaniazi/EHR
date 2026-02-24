"use client";
import React from "react";
import styles from "../../../styles/details.module.css";

type CaseItem = {
  id: string;
  name: string;
  completionDate?: string;
  teamMembers?: string[]; 
  otherInfo?: string; 
};

export default function CompletedCasesList({ cases }: { cases: CaseItem[] }) {
  if (cases.length === 0) return <div className="text-sm text-muted-foreground">No completed simulations yet.</div>;

  return (
    <div className="space-y-3">
      {cases.map((c) => (
        <details key={c.id} className={`${styles.customDetails} bg-white rounded-lg shadow-sm`}>
          <summary className="cursor-pointer px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Completed</span>
                <div>
                  <div className="font-medium text-lg">{c.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">Completed: {c.completionDate ? new Date(c.completionDate).toLocaleDateString() : "-"}</div>
                  {c.teamMembers && c.teamMembers.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">Team: {c.teamMembers.join(", ")}</div>
                  )}
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
            <div className="flex flex-col items-start gap-2">
              <button
                onClick={() => {
                  window.location.href = `http://localhost:3000/feedback/${c.id}`;
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                View Feedback
              </button>

              <button
                onClick={() => {
                  window.location.href = `http://localhost:3000/case-report/${c.id}`;
                }}
                className="px-3 py-1 bg-gray-100 text-sm rounded-md"
              >
                Case Report
              </button>
            </div>
          </div>
          <style jsx>{`
            /* hide native disclosure marker and any list marker/padding */
            .custom-details summary { list-style: none; padding-left: 0; }
            .custom-details summary::-webkit-details-marker { display: none; }
            .custom-details summary::marker { content: none; }
            .custom-details .arrow { transition: transform 0.18s ease; }
            .custom-details[open] .arrow { transform: rotate(90deg); }
          `}</style>
        </details>
      ))}
    </div>
  );
}