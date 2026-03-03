import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button";
interface SubmitButtonProps {
  buttonText: string;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
}

const ContinueButton = ({ buttonText, onClick, tooltip, disabled }: SubmitButtonProps) => {
  return (
    <div className="">
      <Button
        className="w-full cursor-pointer"
        variant={"default"}
        onClick={onClick}
        title={tooltip}
        disabled={disabled}
      >
        {buttonText} <ArrowRight />
      </Button>
    </div>
  )
}

export default ContinueButton