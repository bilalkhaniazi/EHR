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
    <div className="w-full">
      <header className="bg-white border-b px-8 py-4 pb-4 sticky top-0 z-10">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold tracking-tight">ADMIN DASHBOARD</h1>
        </div>
      </header>

      <div className="px-4 md:px-8">
        <h2 className="pl-1 pt-5 pb-2 text-xl font-bold">QUICK ACTIONS</h2>
        <AdminQuickActionsList />
        {/* Summary cards: Students vs Admin/Staff */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
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
        <div className="mt-4 mb-2 max-w-4xl">
          <ResumeCaseDraftCard />
        </div>
        <h2 className="pl-1 pt-5 pb-2 text-xl font-bold">STUDENTS LIST</h2>
        <div className="container mx-auto w-full max-w-full">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}
