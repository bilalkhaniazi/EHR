import { CircleUserRound } from "lucide-react";
import { jamesAllen } from "./chartData";

export default function ChartSidebar() {
  return (
    // <div className="w-72 h-full">
      <div className="w-76 h-full flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2">
          <span className="rounded-full p-1 bg-gray-100 shadow-md">
            <CircleUserRound size={140} strokeWidth={0.8} color="oklch(38% 0.189 293.745)" className="rounded-full bg-white "/>
          </span>
          <div className="flex flex-col items-center">
            <h1 className="text-purple-900 text-lg font-medium tracking-tight">{jamesAllen.indentifiers.name.value}</h1>
            <p className="text-purple-900 text-sm font-light tracking-tight">
              {jamesAllen.indentifiers.dob.label}:
              <span className="pl-2 font-normal">{jamesAllen.indentifiers.dob.value}</span>
            </p>
            <p className="text-purple-900 text-sm font-light tracking-tight">
              {jamesAllen.indentifiers.mrn.label}:
              <span className="pl-2 font-normal">{jamesAllen.indentifiers.mrn.value}</span>
            </p>
          </div>

          <div className="flex flex-col py-4 px-2 rounded-lg shadow-md mt-4 border gap-6 bg-white">
            {/*Demographic Data */}
            <div className="relative flex flex-col border bg-white border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
              <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl  px-1">Demographics</p>
              {Object.values(jamesAllen.demographics).map((row) => {
                return(
                  <p className="text-purple-900 text-xs font-light tracking-tight">
                    <span className="underline">{row.label}:</span>
                    <span className="pl-2 font-normal">{row.value}</span>
                  </p>
                );
              })}
            </div>

            {/*Clinical Data */}
            <div className="relative flex flex-col bg-white border border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
              <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl px-1">Clinical Info</p>
              {Object.values(jamesAllen.clinicalInfo).map((row) => {
                return(
                  <p className="text-purple-900 text-xs font-light tracking-tight">
                    <span className="underline">{row.label}:</span>
                    <span className="pl-2 font-normal decoration-none no-underline">{Array.isArray(row.value) ? row.value.join(", ") : row.value}</span>
                  </p>
                );
              })}
            </div>

            {/*Social Data */}
            <div className="relative flex flex-col bg-white border border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
              <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl px-1">Social Info</p>
              {Object.values(jamesAllen.socialFactors).map((row) => {
                return(
                  <p className="text-purple-900 text-xs font-light tracking-tight">
                    <span className="underline">{row.label}:</span>
                    <span className="pl-2 font-normal">{row.value}</span>
                  </p>
                );
              })}
            </div>
          </div>

        </div>
    // </div>
  )
}