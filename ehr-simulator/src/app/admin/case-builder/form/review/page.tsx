'use client'
import { useFormContext } from "@/context/FormContext"

const FormReview = () => {
  const { data } = useFormContext()
  return (
    <div className="w-full h-screen text-wrap p-4">
      <p className="">{JSON.stringify(data, null, 2)}</p>
    </div>
  )
}

export default FormReview