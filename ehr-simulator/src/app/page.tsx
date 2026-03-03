import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  redirect("/auth/login");
}
