"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export function AdminQuickActionsList() {
  return (
    <div className="flex flex-row gap-2">
      <Link href="/admin/case-builder">
        <Button variant="default">Create New Case</Button>
      </Link>
      <Button variant="default">View All Cases</Button>
      <Button variant="default">Modify Case Template</Button>
    </div>
  );
}
