'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { getDraft, clearDraft, CaseBuilderDraftPayload } from "@/utils/drafts/caseBuilderDraft";
import { toast } from "sonner";

export function ResumeCaseDraftCard() {
  const { user } = useUser();
  const router = useRouter();
  const [draft, setDraftState] = useState<CaseBuilderDraftPayload | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setDraftState(null);
      return;
    }
    const existing = getDraft(user.id);
    setDraftState(existing);
  }, [user?.id]);

  if (!draft) return null;

  const handleResume = () => {
    const targetPath =
      draft.lastVisitedPath && draft.lastVisitedPath.startsWith("/admin/case-builder/")
        ? draft.lastVisitedPath
        : "/admin/case-builder/form/demographics";

    router.push(targetPath);
  };

  const handleDiscard = () => {
    if (!user?.id) return;
    clearDraft(user.id);
    setDraftState(null);
    toast("Draft discarded", {
      description: "The local case draft has been removed from this device.",
    });
  };

  const lastSavedLabel = draft.updatedAt
    ? new Date(draft.updatedAt).toLocaleString()
    : null;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resume Case Draft</span>
          {lastSavedLabel && (
            <span className="text-xs text-slate-400">
              Last saved {lastSavedLabel}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          A case draft is saved locally on this device. You can resume editing
          where you left off or discard it to start a new case.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" type="button" onClick={handleDiscard}>
          Discard Draft
        </Button>
        <Button size="sm" type="button" onClick={handleResume}>
          Resume Case
        </Button>
      </CardFooter>
    </Card>
  );
}

