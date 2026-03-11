import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Link href="/simulation/123/chart/overview" passHref className="p-4">
        <Button>EHR Simulation Demo</Button>
      </Link>
      <Link href="/admin" passHref>
        <Button>Admin Portal</Button>
      </Link>
    </div>
  );
}
