import { OctagonAlert } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { PathologyReportData } from "./labsData";

interface PathologyReportProps {
  cellLabel: string;
  report: PathologyReportData;
}

export default function PathologyReport({ report, cellLabel }: PathologyReportProps) {

  return (
    <Dialog>
      <DialogTrigger 
        className="px-2 w-full text-xs flex justify-center gap-2"
      >
        {cellLabel}{report.critical && <OctagonAlert size={16} color="#e60000" />}
      </DialogTrigger>
      <DialogContent className="p-4 sm:max-w-3/4 xl:max-w-4xl overflow-y-auto gap-0">
        <div className="flex justify-between w-full">
          <DialogTitle className="flex h-fit items-baseline gap-2 pb-2">
            {report.critical && <OctagonAlert size={18} color="#e60000" />}{report.sampleType}
            <span className="pl-3 text-sm text-gray-900 font-light">(Status: Final)</span>
          </DialogTitle>
        </div>
        <div className="grid gap-1">
          <div>
            <h1 className="text-sm font-medium ">Appearance</h1>
            <p className="pl-2 text-sm text-left text-gray-800 tracking-tight">
              {report.appearance}
            </p>
            <Separator className="my-1" />
          </div>
          <div>
            <h1 className="text-sm font-medium ">Microscopy</h1>
            <p className="pl-2 text-sm text-left text-gray-800 tracking-tight">
              {report.microscopy}
            </p>
            <Separator className="my-1" />
          </div>
          <div>
            <div className="flex gap-1">
              <h1 className="text-sm font-medium">Culture</h1>
              {report.critical && <p className="text-sm font-bold text-red-500">!!</p>}
            </div>
            <p className="flex pl-2 text-sm text-left text-gray-800 tracking-tight">
              {report.culture}
            </p>
            <Separator className="my-1" />
          </div>
          <div>
            <h1 className="text-sm font-medium ">Sensitivity</h1>
            <p className="pl-2 text-sm text-left text-gray-800 tracking-tight">
              {report.sensitivity}
            </p>
            <Separator className="my-1" />
          </div>
          <div>
            <h1 className="text-sm font-medium ">Comments</h1>
            <p className="pl-2 text-sm text-left text-gray-800 tracking-tight">
              {report.comments}
            </p>
          </div>
         
        </div>
      </DialogContent>
    </Dialog>
  )

}
 