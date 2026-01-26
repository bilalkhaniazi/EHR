import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateCaseButton() {
  const router = useRouter();
  const createCase = () => {
    // new case in db?
    router.push('/admin/case-builder/form/demographics')
  }

  return (
    <Button onClick={createCase} className="cursor-pointer">
      Create New Case
    </Button>
  )

}