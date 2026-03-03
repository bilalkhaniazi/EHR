'use client';

import ContinueButton from "./continueButton";
import BackButton from "./goBackButton";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { useFormContext } from "@/context/FormContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface FormShellProps {
  children: React.ReactNode;
  title: string;
  stepDescription: string;
  icon: React.ReactNode;
  onSubmit: () => void;
  goBack: () => void;
  continueButtonText: string;
  backButtonText: string;
  continueButtonTooltip?: string;
  backButtonTooltip?: string;
  continueDisabled?: boolean;
}

export function FormShell({
  children,
  title,
  stepDescription,
  icon,
  onSubmit,
  goBack,
  backButtonText,
  continueButtonText,
  continueButtonTooltip,
  backButtonTooltip,
  continueDisabled,
}: FormShellProps) {
  const { saveDraftNow, resetDraft, lastSavedAt, updateLastVisitedPath } = useFormContext();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      updateLastVisitedPath(pathname);
    }
  }, [pathname, updateLastVisitedPath]);

  const handleSaveDraftClick = () => {
    saveDraftNow();
    toast("Draft saved on this device only.", {
      description:
        "Draft saved on this device only. Logging out or clearing browser data may remove it.",
    });
  };

  const handleConfirmReset = () => {
    resetDraft();
    setShowResetConfirm(false);
    toast("Draft cleared.", {
      description:
        "Your saved draft was removed and all fields were reset.",
    });
  };

  const formattedLastSaved = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString()
    : null;

  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-slate-50/50 overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shadow">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {icon} {title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{stepDescription}</p>
          {formattedLastSaved && (
            <p className="text-[11px] text-slate-400 mt-1">
              Last saved at {formattedLastSaved}
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraftClick}
          >
            <Save className="w-4 h-4 mr-1" />
            Save Draft
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <BackButton
            tooltip={backButtonTooltip}
            onClick={goBack}
            buttonText={backButtonText}
          />
          <ContinueButton
            tooltip={continueButtonTooltip}
            onClick={onSubmit}
            buttonText={continueButtonText}
            disabled={continueDisabled}
          />
        </div>
      </header>
      {children}

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset case builder?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your saved draft and clear all fields.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleConfirmReset}
            >
              Yes, reset everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

