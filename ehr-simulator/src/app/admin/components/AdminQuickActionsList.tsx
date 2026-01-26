"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import CreateCaseButton from "./CreateCaseButton";

export function AdminQuickActionsList() {
  const router = useRouter();
  return (
    <div className="flex flex-row gap-2">
      <CreateCaseButton />
      <Button
        onClick={() => { router.push("/admin/cases") }}
        className="cursor-pointer"
        variant="default">
        View All Cases
      </Button>
    </div>
  );
}
