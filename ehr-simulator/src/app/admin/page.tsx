import { columns, StudentInfo } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<StudentInfo[]> {
  return [
    {
      id: "1",
      full_name: "John Doe",
      email: "john@example.com",
      cohort: "2027",
      classes: ["NUR 280"],
    },
    {
      id: "2",
      full_name: "Max Mulder",
      email: "maxmulder03@gmail.com",
      cohort: "2027",
      classes: ["NUR 350"],
    },
    {
      id: "3",
      full_name: "Matt Smith",
      email: "matt@example.com",
      cohort: "2026",
      classes: ["NUR 280"],
    },
  ]
}

export default async function AdminPage() {
  const data = await getData()

  return (
    <div className="">
      <h1 className="container mx-auto py-10 text-4xl"> Admin Dashboard </h1>

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
