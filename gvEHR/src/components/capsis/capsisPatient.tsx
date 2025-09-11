import { Button } from "../ui/button"

const CapsisPatient = () => {

  const patient = {
      name: "Smith, Steve",
      mrn: "543561",
      dob: "01/20/1998",
      age: 27
    }



  
  return (
    <div className="h-screen w-full flex flex-col bg-sky-700 px-10 py-5 gap-5">
      <h1 className="pl-4 text-white text-4xl font-bold font-museo">Capsis</h1>
      <div className="h-full rounded-lg shadow-inner shadow-black/30">

        <div className="grid grid-cols-2 grid-rows-1 gap-8 bg-sky">
          <div className="">
            <div className="bg-white flex flex-col focus:bg-neutral-100 gap-2 p-2 w-full border-b rounded-t-lg border-neutral-300">
              <h2 className="text-md w-full text-left">{patient.name}</h2>
              <div className="flex gap-1 text-neutral-600 text-sm font-light">
                <span className="">{patient.age} years old,</span>
                <span className="">{patient.dob}</span>
              </div>
            </div>
            <div className="bg-neutral-200 flex flex-col h-full w-full">
              {/* {patients.map((patient) => {
                    return (
                      <button className="bg-white flex flex-col focus:bg-neutral-100 gap-2 p-2 w-full border-b border-x border-neutral-300 first:rounded-t-lg first:border-t last:rounded-b-lg">
                        <h2 className="text-md w-full text-left">{patient.name}</h2>
                        <div className="flex gap-1 text-neutral-600 text-sm font-light">
                          <span className="">{patient.age} years old,</span>
                          <span className="">{patient.dob}</span>
                        </div>
                      </button>

                    )
                  })} */}


            </div>
          </div>
          <div className="h-10 w-full bg-white"></div>
    
          



        </div>
  
      </div>
      <div className="w-full flex justify-center gap-8" >
        <Button className="bg-white text-black shadow hover:bg-neutral-200">My Patients</Button>
        <Button className="bg-white text-black shadow hover:bg-neutral-200">Inventory Count</Button>
        <Button className="bg-white text-black shadow hover:bg-neutral-200">Discrepancy</Button>
      </div>

    </div>
  )
}

export default CapsisPatient