import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function Home() {

  const { data: users } = await supabase.from("users").select("*");
  console.log(users);

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
