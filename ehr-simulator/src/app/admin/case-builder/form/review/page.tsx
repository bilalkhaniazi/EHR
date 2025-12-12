'use client'
import { useFormContext } from "@/context/FormContext"

const FormReview = () => {
  const {
    demographicData,
    historyData,
    noteData,
    orderData
  } = useFormContext()
  return (
    <div className="w-full h-screen p-4">
      <pre>{JSON.stringify(demographicData, null, 4)}</pre>
      <pre>{JSON.stringify(historyData, null, 4)}</pre>
      <pre>{JSON.stringify(noteData, null, 4)}</pre>
      <pre>{JSON.stringify(orderData, null, 4)}</pre>
    </div>
  )
}

export default FormReview