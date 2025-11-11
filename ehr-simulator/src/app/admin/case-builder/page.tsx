
import Link from "next/link"

const CaseBuilder = () => {
  return (
    <>
      <div className="flex flex-col m-16 gap-4">
        <Link href={"/admin/case-builder/new/demographics"}>
          <button className="p-1 border rounded cursor-pointer">
            New Case
          </button>
        </Link>

        <Link href={"/admin/case-builder/new/demographics"}>
          <button className="p-1 border rounded cursor-pointer">
            Edit Case
          </button>
        </Link>

      </div>
    </>
  )
}
export default CaseBuilder
