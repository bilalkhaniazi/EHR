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
      {/* Summary cards: Students vs Admin/Staff */}
      <div className="container mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(() => {
          const students = data.filter(d => d.role === 'student');
          const staff = data.filter(d => d.role && d.role !== 'student');
          return (
            <>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Students</h3>
                <div className="mt-2 text-3xl font-bold">{students.length}</div>
                <p className="mt-1 text-sm text-muted-foreground">Total student accounts</p>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Admin / Staff</h3>
                <div className="mt-2 text-3xl font-bold">{staff.length}</div>
                <p className="mt-1 text-sm text-muted-foreground">Total admin & faculty accounts</p>
              </div>
            </>
          )
        })()}
      </div>

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
