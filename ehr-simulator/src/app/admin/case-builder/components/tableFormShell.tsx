import SubmitButton from "./submitButton";

interface FormShellProps {
  title: string;
  stepDescription: string;
  icon: React.ReactNode;
  onSubmit: () => void;
  children: React.ReactNode;
}

export function TableFormShell({ title, stepDescription, icon, onSubmit, children }: FormShellProps) {
  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-white overflow-hidden shadow-sm border border-slate-200">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shadow">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {icon} {title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{stepDescription}</p>
        </div>
        <div>
          <SubmitButton onClick={onSubmit} buttonText="Save & Continue" />
        </div>
      </header>
      <div className="flex-1 flex flex-col min-h-0 px-6 pt-4">
        {children}
      </div>
    </div>
  );
}