export const CaseSection = {
  DEMOGRAPHICS: "DEMOGRAPHICS",
  HISTORY: "HISTORY",
  ORDERS: "ORDERS",
  LABS: "LABS",
  DOCUMENTATION: "DOCUMENTATION",
  MEDICATION: "MEDICATION",
} as const;

export type CaseSection = typeof CaseSection[keyof typeof CaseSection];
