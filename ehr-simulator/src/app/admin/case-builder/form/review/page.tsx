'use client'
import { useFormContext } from "@/context/FormContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ClipboardCheck } from "lucide-react"
import { FormShell } from "../../components/formShell"
import { createCaseData } from "@/actions/cases"

const FormReview = () => {
  const {
    demographicData,
    historyData,
    noteData,
    orderData,
    labData,
    chartingData,
    ioData,
    medOrderData,
    medAdministrationData
  } = useFormContext()

  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goBack = () => {
    router.push("/admin/case-builder/form/medication-administrations");
  }

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    const name =
      demographicData.caseName?.trim() ||
      [demographicData.firstName, demographicData.lastName].filter(Boolean).join(" ").trim() ||
      "Unnamed Case";
    const ageRaw = demographicData.age?.trim();
    const age = ageRaw !== "" ? parseInt(ageRaw, 10) : null;
    if (ageRaw !== "" && (Number.isNaN(age) || age === null)) {
      setSubmitError("Age must be a valid number.");
      setIsSubmitting(false);
      return;
    }

    const result = await createCaseData({
      name,
      description: demographicData.summary?.trim() || null,
      age: age ?? null,
      diagnosis: demographicData.admittingDiagnosis?.trim() || null,
    });

    setIsSubmitting(false);
    if (!result.success) {
      setSubmitError(result.message ?? "Failed to create case.");
      return;
    }
    router.push("/admin/case-builder/form/success");
  }

  return (
    <FormShell
      title="Review & Submit Case"
      stepDescription="Step 10 of 9: Review case before submitting"
      icon={<ClipboardCheck className="text-slate-400" />}
      onSubmit={handleSubmit}
      goBack={goBack}
      continueButtonText={isSubmitting ? "Submitting…" : "Submit Case"}
      backButtonText="Back"
      continueButtonTooltip="Proceed to Next Page"
      backButtonTooltip="Return to Previous Page"
      continueDisabled={isSubmitting}
    >
      <div className="flex flex-col h-screen w-full bg-slate-50/50 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 h-full max-w-7xl mx-auto pb-20">
            <div className="flex flex-col gap-2">
              {submitError && (
                <div className="rounded-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
                  {submitError}
                </div>
              )}
              <h2 className="text-nowrap font-bold mt-4">Demographics Data</h2>
              <pre>{JSON.stringify(demographicData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">History Data</h2>
              <pre>{JSON.stringify(historyData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">Notes Data</h2>
              <pre>{JSON.stringify(noteData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">Orders Data</h2>
              <pre>{JSON.stringify(orderData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">Lab Data</h2>
              <pre>{JSON.stringify(labData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">Charting Data</h2>
              <pre>{JSON.stringify(chartingData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">Input-Output Data</h2>
              <pre>{JSON.stringify(ioData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">Medication Order Data</h2>
              <pre>{JSON.stringify(medOrderData, null, 4)}</pre>

              <h2 className="text-nowrap font-bold mt-4">Medication Administration Data</h2>
              <pre>{JSON.stringify(medAdministrationData, null, 4)}</pre>

            </div>
          </div>
        </main>
      </div>
    </FormShell>
  )
}

export default FormReview