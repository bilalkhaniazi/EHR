import type { ImagingData } from "./labsData"
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";

interface ImagingReportProps {
  cellName: string;
  imagingReportContents: ImagingData;
}
const ImagingReport = ({ imagingReportContents, cellName }: ImagingReportProps) => {
  return (
    <Dialog>
      <DialogTrigger 
        className="w-full text-xs"
      >
        {cellName}
      </DialogTrigger>
      <DialogContent className="px-4 py-6 sm:max-w-3/4 xl:max-w-4xl overflow-y-auto gap-0" id="asdf" aria-describedby="asdf">
        <div className="flex justify-between w-full">
          <DialogTitle>{imagingReportContents.displayName}</DialogTitle>
          {/* <Button 
            className="bg-transparent shadow-none outline-none ring-0 hover:bg-transparent p-1"
            onClick={() => setOpen(false)}
          >
          </Button> */}
        </div>
          
            <h1 className="text-md font-medium ">Technique</h1>
            <p className="pl-2 text-sm text-left text-gray-700">
              {imagingReportContents.technique}
            </p>
            <Separator className="my-1" />
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
            <Separator className="my-1" />

            <h1 className="text-md font-medium ">Impressions</h1>
              <ul className="pl-5 list-disc">
                {imagingReportContents.impression.map((value, index) => (
                  <li key={index} className="text-sm text-left text-gray-700">
                      {value}
                  </li>
                ))}
              </ul>
      </DialogContent>
    </Dialog>
  )

}

export default ImagingReport