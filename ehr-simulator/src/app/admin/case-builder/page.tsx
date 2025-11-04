
import Link from "next/link"

const CaseBuilder = () => {
  return (
    <>
      <Link href={"/admin/case-builder/demographics"}>
        <button className="border">
          New Case From Scratch
        </button>
      </Link>
    </>
  )
}
export default CaseBuilder
