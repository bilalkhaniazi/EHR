import SubmitButton from "./submitButton";
import GoBackButton from "./goBackButton"

interface FormShellProps {
  title: string;
  stepDescription: string;
  icon: React.ReactNode;
  onSubmit: () => void;
  goBack: () => void;
  children: React.ReactNode;
}

export function TableFormShell({ title, stepDescription, icon, onSubmit, goBack, children }: FormShellProps) {
  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-white overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shadow">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {icon} {title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{stepDescription}</p>
        </div>
        <div className="flex gap-2 fixed top-6 right-8 z-10">
          <GoBackButton onClick={goBack} buttonText="Go Back" />
          <SubmitButton onClick={onSubmit} buttonText="Continue" />
        </div>
      </header>
      <div className="flex-1 flex flex-col min-h-0 px-6 pt-4">
        {children}
      </div>
    </div>
  );
}