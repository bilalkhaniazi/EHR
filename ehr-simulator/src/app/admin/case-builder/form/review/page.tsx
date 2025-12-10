'use client'
import { useFormContext } from "@/context/FormContext"

const FormReview = () => {
  const { data } = useFormContext()
  return (
    <div className="w-full h-screen p-4">
      <pre id='JSON'>{JSON.stringify(data, null, 4)}</pre>
    </div>
  )
}

export default FormReview