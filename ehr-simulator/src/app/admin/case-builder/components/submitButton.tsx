import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button";
interface SubmitButtonProps {
  buttonText: string;
  onClick: () => void;
}

const SubmitButton = ({ buttonText, onClick }: SubmitButtonProps) => {
  return (
    <div className="flex flex-col gap-2 w-fit">
      <Button
        className="w-full cursor-pointer"
        variant={"default"}
        onClick={onClick}
      >
        {buttonText} <ArrowRight />
      </Button>
    </div>
  )
}

export default SubmitButton

