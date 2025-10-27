import { columns, StudentInfo } from "./columns"
import { DataTable } from "./data-table"
import { AdminQuickActionsList } from "./AdminQuickActionsList"

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
    <div className="pl-4">
      <h1 className="container mx-auto pt-10 text-4xl font-bold"> ADMIN DASHBOARD </h1>
      <h2 className="container mx-auto pl-1 pt-5 pb-2 text-xl font-bold">QUICK ACTIONS</h2>
      <AdminQuickActionsList />
      <h2 className="container mx-auto pl-1 pt-5 pb-2 text-xl font-bold">STUDENTS LIST</h2>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
