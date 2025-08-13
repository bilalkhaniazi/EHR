import { Stethoscope } from "lucide-react"

const AdminHeader = () => {
  return (
    <header className="sticky top-0 border-b h-(--header-height)">
      <div className="flex  h-(--header-height) justify-left items-center pl-8 gap-2">
        <Stethoscope color="white" size={26} strokeWidth={2.5}/>
        <h1 className="text-3xl font-bold text-white">
          <span>Flex</span>
          <span className="font-normal">Chart</span>
        </h1>
      </div>
    </header>
  )
} 

export default AdminHeader