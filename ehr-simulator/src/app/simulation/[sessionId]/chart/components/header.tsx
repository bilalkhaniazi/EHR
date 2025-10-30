import { Settings, Stethoscope } from "lucide-react"
import type { ReactNode } from "react"
import Link from 'next/link'

interface HeaderProps {
  tabs?: ReactNode;
}

const Header = ({ tabs }: HeaderProps) => {
  return (
    <header className="border-b h-(--header-height)">
      <div className="flex h-(--header-height) justify-between items-center pl-12 gap-2">
        <div className="flex items-center gap-2">
          <Stethoscope color="white" size={26} strokeWidth={2.5} />
          <Link href="/admin" >
            <h1 className="text-3xl font-bold text-white hover:underline">
              <span>Flex</span>
              <span className="font-normal">Chart</span>
            </h1>
          </Link>
        </div>
        {tabs}

        <div className="pr-8">
          <Link href="#">
            <Settings color="#ffffff" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header