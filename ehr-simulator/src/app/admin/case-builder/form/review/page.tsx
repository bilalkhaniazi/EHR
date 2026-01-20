'use client'
import { useFormContext } from "@/context/FormContext"
import SubmitButton from "../../components/submitButton"
import GoBackButton from "../../components/goBackButton"
import { useRouter } from "next/navigation"
import { ClipboardCheck } from "lucide-react"

const FormReview = () => {
  const {
    demographicData,
    historyData,
    noteData,
    orderData
  } = useFormContext()

  const router = useRouter();

  const goBack = () => {
    router.push("/admin/case-builder/form/medication-administrations");
  }

  const handleSubmit = () => {
    // push to db
    router.push("/admin/case-builder/form/success");

  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 overflow-hidden">
      <header className="flex-none flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="text-slate-400" />
            Review Case
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 10 of 9: Review case before submitting.</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 h-full max-w-7xl mx-auto pb-20">
          <div className="flex gap-2 fixed top-6 right-8 z-10">
            <GoBackButton onClick={goBack} buttonText="Back" />
            <SubmitButton onClick={handleSubmit} buttonText="Submit Case" />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-nowrap font-bold underline mt-2">Demographics Data</h2>
            <pre>{JSON.stringify(demographicData, null, 4)}</pre>

            <h2 className="text-nowrap font-bold underline mt-2">History Data</h2>
            <pre>{JSON.stringify(historyData, null, 4)}</pre>

            <h2 className="text-nowrap font-bold underline mt-2">Notes Data</h2>
            <pre>{JSON.stringify(noteData, null, 4)}</pre>

            <h2 className="text-nowrap font-bold underline mt-2">Orders Data</h2>
            <pre>{JSON.stringify(orderData, null, 4)}</pre>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FormReview