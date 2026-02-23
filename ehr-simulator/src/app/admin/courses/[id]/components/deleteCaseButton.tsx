'use client'

import { deleteSectionCaseAssignment } from "@/actions/cases";
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCaseButtonProps {
  caseId: string;
}

const DeleteCaseButton = ({ caseId }: DeleteCaseButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (caseId: string) => {
    setIsDeleting(true);
    const result = await deleteSectionCaseAssignment(caseId);

    if (!result.success) {
      toast.error(result.message);
      setIsDeleting(false);
      return;
    }
    setIsDeleting(false);
  }

  return (
    <Button
      variant='ghost'
      className="group hover:bg-red-100 size-6"
      onClick={() => handleDelete(caseId)}
      disabled={isDeleting}
    >
      <Trash className="text-gray-300 group-hover:text-red-500" />
    </Button>
  )
}

export default DeleteCaseButton;