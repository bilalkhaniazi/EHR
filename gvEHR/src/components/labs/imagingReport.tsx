import { X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import type { imagingData } from "./labsData"
import { Separator } from "../ui/separator";

interface ImagingReportProps {
  cellName: string;
  imagingReportContents: imagingData;
}
const ImagingReport = ({ imagingReportContents, cellName }: ImagingReportProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full text-xs ">
        {cellName}
      </AlertDialogTrigger>
      <AlertDialogContent className="px-4 py-6 sm:max-w-3/4 xl:max-w-4xl overflow-y-auto gap-0" id="asdf" aria-describedby="asdf">
        <div className="flex justify-between w-full">
          <AlertDialogTitle>{imagingReportContents.displayName}</AlertDialogTitle>
          <AlertDialogAction className="bg-transparent shadow-none outline-none ring-0 hover:bg-transparent p-1">
            <X color="black" />
          </AlertDialogAction>
        </div>
        <AlertDialogHeader className="p-0 items-start gap-">
          
            <h1 className="text-md font-medium ">Technique</h1>
            <p className="pl-2 text-sm text-left text-gray-700">
              {imagingReportContents.technique}
            </p>
            <Separator className="mb-1" />
            <h1 className="text-md font-medium ">Findings</h1>
            <div className="pl-2">
              {Object.entries(imagingReportContents.findings).map(([key, value], index) => (
                <div key={index} className="flex items-start gap-1 mb-1">
                  <p className="text-sm text-left text-gray-700">
                    <span className="text-black font-medium pr-2">{key}:</span>
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="mb-1" />

            <h1 className="text-md font-medium ">Impressions</h1>
              <ul className="pl-5 list-disc">
                {imagingReportContents.impression.map((value, index) => (
                  <li key={index} className="text-sm text-left text-gray-700">
                      {value}
                  </li>
                ))}
              </ul>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )

}

export default ImagingReport