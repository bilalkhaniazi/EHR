import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button";

const SubmitButton = ({ buttonText }: { buttonText: string }) => {
  return (
    <div className="flex flex-col gap-2 w-fit">
      <Button
        className="w-full cursor-pointer"
        variant={"default"}
        type="submit" >
        {buttonText} <ArrowRight />
      </Button>
    </div>
  )
}

export default SubmitButton

