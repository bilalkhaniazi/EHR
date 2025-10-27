"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

export function AdminQuickActionsList() {
  return (
    <div className="flex flex-row gap-2">
      <Button variant="default">Create New Case</Button>
      <Button variant="default">View All Cases</Button>
      <Button variant="default">Modify Case Template</Button>
    </div>
  );
}
