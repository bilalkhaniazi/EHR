import { supabase } from "@/lib/supabaseClient";

export default async function Home() {

  const { data: users } = await supabase.from("users").select("*");
  console.log(users);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1>Hello, world!</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
