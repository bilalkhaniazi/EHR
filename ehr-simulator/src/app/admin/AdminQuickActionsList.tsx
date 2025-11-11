"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export function AdminQuickActionsList() {
  return (
    <div className="flex flex-row gap-2">

      <Link href="/admin/case-builder" >
        <Button className="cursor-pointer" variant="default">Create New Case</Button>
      </Link>
      <Link href="/admin/cases" >
        <Button className="cursor-pointer" variant="default">View All Cases</Button>
      </Link>
      <Link href={"#"}>
        <Button className="cursor-pointer" variant="default">Modify Case Template</Button>
      </Link>
    </div>
  );
}
