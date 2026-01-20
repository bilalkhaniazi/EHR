import ContinueButton from "./continueButton";
import BackButton from "./goBackButton"

interface FormShellProps {
  children: React.ReactNode
  title: string
  stepDescription: string
  icon: React.ReactNode
  onSubmit: () => void
  goBack: () => void
  continueButtonText: string
  backButtonText: string
  continueButtonTooltip?: string
  backButtonTooltip?: string
}

export function FormShell({ children, title, stepDescription, icon, onSubmit, goBack, backButtonText, continueButtonText, continueButtonTooltip, backButtonTooltip }: FormShellProps) {
  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-slate-50/50 overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shadow">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {icon} {title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{stepDescription}</p>
        </div>
        <div className="flex gap-2">
          <BackButton tooltip={backButtonTooltip} onClick={goBack} buttonText={backButtonText} />
          <ContinueButton tooltip={continueButtonTooltip} onClick={onSubmit} buttonText={continueButtonText} />
        </div>
      </header>
      {children}
    </div>
  );
}