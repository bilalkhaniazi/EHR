import * as React from "react";
import Link from "next/link";
import { Database } from "../../../../database.types";

export type SimCase = Database['public']['Tables']['case_data']['Row'];

interface CaseListItemProps {
  simCase: SimCase;
}

export default function CaseListItem({ simCase }: CaseListItemProps) {
  const { id, name } = simCase;

  return (
    <Link href={`/admin/case-builder/${id}/demographics`}>
      <div className="border rounded-md p-4 hover:bg-secondary dark:hover:bg-gray-800 transition py-5 border-l-10 border-l-blue-700 cursor-pointer">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-md text-gray-500">Patient: {id}</p>
        <p className="text-sm text-gray-400 mt-2 line-clamp-2">Future Description</p>
      </div>
    </Link>
  );
}
