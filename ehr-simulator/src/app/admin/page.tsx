import { columns, StudentInfo } from "./columns"
import { DataTable } from "./data-table"
import { AdminQuickActionsList } from "./components/AdminQuickActionsList"
import { ResumeCaseDraftCard } from "./components/ResumeCaseDraftCard"
import { getAllUsers } from "@/actions/users"

async function getData(): Promise<StudentInfo[]> {
  return await getAllUsers();
}

export default async function AdminPage() {
  const data = await getData()

  return (
    <div className="pl-4">
      <h1 className="container mx-auto pt-10 text-4xl font-bold"> ADMIN DASHBOARD </h1>
      <h2 className="container mx-auto pl-1 pt-5 pb-2 text-xl font-bold">QUICK ACTIONS</h2>
      <AdminQuickActionsList />
      <div className="container mx-auto mt-4 mb-2">
        <ResumeCaseDraftCard />
      </div>
      <h2 className="container mx-auto pl-1 pt-5 pb-2 text-xl font-bold">STUDENTS LIST</h2>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
