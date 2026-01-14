'use client'
import { Card } from "@/components/ui/card"
import { useFormContext } from "@/context/FormContext"

const FormReview = () => {
  const { demographicData, historyData, noteData, orderData, ioData, labData, chartingData, medOrderData, medAdministrationData } = useFormContext()
  const titles = ["Demographics", "History", "Notes", "Orders", "Intake/Output", "Labs", "Charting", "Med Orders", "Med Administrations"]
  return (
    <div className="w-full h-screen p-4">
      {[demographicData, historyData, noteData, orderData, ioData, labData, chartingData, medOrderData, medAdministrationData].map((data, index) => (
        <Card key={index} className="my-6 pl-3 text-sm">
          <div>
            <h1 className="text-lg font-bold ml-3">{titles[index]} Data</h1>
            <pre id='JSON'>{JSON.stringify(data, null, 4)}</pre>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default FormReview