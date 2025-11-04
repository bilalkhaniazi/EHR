"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const SubmitButton = () => {
  return (
    <div className="flex flex-col gap-2 max-w-[50%] ">
      <hr />
      <Button
        className="w-full cursor-pointer"
        variant={"default"}
        type="submit" >
        Continue <ArrowRight />
      </Button>
    </div>
  )
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.target as HTMLFormElement);
  const payload = Object.fromEntries(formData);
  console.log(payload);

  // Process data and save to patient object
  // Move to next page of the form
  // Backend shenanigans
}

const FormLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col bg-neutral-100 flex-1 gap-2 p-2 pb-2 overflow-y-auto">
      <Card>
        <form className="w-full pl-16 pr-16 flex" onSubmit={handleSubmit} >
          <div className="w-full flex flex-col gap-2 p-2">
            {children}
            <SubmitButton />
          </div>
        </form>
      </Card>
    </div>
  )
}
export default FormLayout