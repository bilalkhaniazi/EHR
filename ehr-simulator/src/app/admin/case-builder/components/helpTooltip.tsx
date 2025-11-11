
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const InfoTooltip = ({ content }: { content: string }) => {

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button">
          <Info size={16} color="var(--muted-foreground)" />
        </TooltipTrigger>
        <TooltipContent className="w-fit">
          <p className="max-w-120 text-wrap">
            {content}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default InfoTooltip