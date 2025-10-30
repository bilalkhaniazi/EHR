import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function Home() {

  const { data: users } = await supabase.from("users").select("*");
  console.log(users);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1>Hello, world!</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <Link href="/simulation/123/chart/overview" passHref>
        <Button>To EHR</Button>
      </Link>
    </div>
  );
}
