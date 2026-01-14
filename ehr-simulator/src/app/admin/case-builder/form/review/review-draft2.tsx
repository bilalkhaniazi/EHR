import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, ArrowRight, FileInput } from "lucide-react";
import SubmitButton from "../../components/submitButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Review() {
  const router = useRouter()
  return (

    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">

      <header className="sticky top-0 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-slate-400" />
            Review
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step 10 of 9: Basic identification and admission details</p>
        </div>
      </header>

      <div className="flex-1 p-6 md:px-12 lg:px-24">
        <div className="fixed top-6 right-8 z-10">
          <SubmitButton onClick={() => { router.push('admin/case-builder/form/review/') }} buttonText="Save & Return to Dashboard" />
        </div>

        <div className="grid grid-cols-1 gap-6">

          <Card className="border-slate-200 shadow-sm pt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Pre-Sim Review
              </CardTitle>
              <CardDescription>Review case from students&apos; pre-sim view.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">To Pre-Sim EHR <ArrowRight /></Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm pt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Full Sim Review
              </CardTitle>
              <CardDescription>Review case from students&apos; full sim view.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">To Full Sim EHR <ArrowRight /></Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm pt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileInput className="w-5 h-5 text-blue-600" />
                Edit Case
              </CardTitle>
              <CardDescription>Navigate back to a form to make changes.</CardDescription>
            </CardHeader>
            <CardContent>

              <div className="grid gap-3">
                <Link href={"/admin/case-builder/form/demographics"}>
                  <Button className="cursor-pointer" variant={"outline"}>Patient Demographics<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/history"}>
                  <Button className="cursor-pointer" variant={"outline"}>Patient History<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/notes"}>
                  <Button className="cursor-pointer" variant={"outline"}>Clinical Documentation<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/orders"}>
                  <Button className="cursor-pointer" variant={"outline"}>Order Entry<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/labs"}>
                  <Button className="cursor-pointer" variant={"outline"}>Lab Results<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/charting"}>
                  <Button className="cursor-pointer" variant={"outline"}>Documentation Results<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/intake-output"}>
                  <Button className="cursor-pointer" variant={"outline"}>Intake & Output<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/medications"}>
                  <Button className="cursor-pointer" variant={"outline"}>Medication Orders<ArrowRight /></Button>
                </Link>
                <Link href={"/admin/case-builder/form/medication-administrations"}>
                  <Button className="cursor-pointer" variant={"outline"}>Medication History<ArrowRight /></Button>
                </Link>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>



    </div>

  )
}