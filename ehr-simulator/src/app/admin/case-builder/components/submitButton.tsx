import { ArrowRight } from "lucide-react"
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SubmitButton = ({ href, buttonText }: { href: string, buttonText: string }) => {
  return (
    <div className="flex flex-col gap-2 max-w-[50%] ">
      <hr />
      <Link href={href}>
        <Button
          className="w-full cursor-pointer"
          variant={"default"}
          type="submit" >
          {buttonText} <ArrowRight />
        </Button>
      </Link>
    </div>
  )
}

export default SubmitButton

