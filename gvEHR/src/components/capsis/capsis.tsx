import { Button } from "../ui/button"

const Capsis = () => {
  const patients = [
    {
      name: "Smith, Steve",
      mrn: "543561",
      dob: "01/20/1998",
      age: 27
    },
    {
      name: "Smith, Sam",
      mrn: "9801734",
      dob: "11/10/1956",
      age: 69

    },
    {
      name: "Smith, Sydney",
      mrn: "443561",
      dob: "11/10/1978",
      age: 47
    },
  ]
  return (
    <div className="h-screen w-full flex flex-col bg-sky-700 px-10 py-5 gap-5">
      <h1 className="pl-4 text-white text-4xl font-bold font-museo">Capsis</h1>
      <div className="h-full flex flex-col bg-neutral-100 border border-neutral-400 rounded-lg shadow-inner shadow-black/30 px-10 py-6 ">
        {patients.map((patient) => {
          return (
            <button className="bg-white flex flex-col focus:bg-neutral-100 gap-2 p-2 w-full border-b border-x border-neutral-300 first:rounded-t-lg first:border-t last:rounded-b-lg">
              <h2 className="text-md w-full text-left">{patient.name}</h2>
              <div className="flex gap-1 text-neutral-600 text-sm font-light">
                <span className="">{patient.age} years old,</span>
                <span className="">{patient.dob}</span>
              </div>
            </button>

          )
        })}
      </div>
      <div className="w-full flex justify-center gap-8" >
        <Button className="bg-white text-black shadow hover:bg-neutral-200">My Patients</Button>
        <Button className="bg-white text-black shadow hover:bg-neutral-200">Inventory Count</Button>
        <Button className="bg-white text-black shadow hover:bg-neutral-200">Discrepancy</Button>
      </div>

    </div>
  )
}

export default Capsis