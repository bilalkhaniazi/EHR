import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { mergedDevAccessEmails } from "@/lib/devAccess";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ensure we have an authenticated user
    if (!user) {
      redirect("/auth/login");
    }

    // Local dev escape hatch:
    // If `DEV_ADMIN_EMAILS` and/or `DEV_BUILDER_FULL_ACCESS_EMAILS` is set, only those emails
    // can access `/admin` without needing `public.users.role = 'admin'` yet.
    //
    // Reversible: unset both in production (or leave empty) for normal admin checks.
    if (process.env.NODE_ENV !== "production") {
      const allowed = mergedDevAccessEmails();

      if (allowed.length > 0) {
        const email = (user.email ?? "").toLowerCase();
        if (!email || !allowed.includes(email)) {
          return (
            <main className="p-8 min-h-screen flex items-center justify-center">
              <div className="max-w-xl w-full text-center bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold mb-2">Not authorized</h1>
                <p className="text-sm text-muted-foreground">
                  You do not have permission to access the admin area.
                </p>
              </div>
            </main>
          );
        }
      }

      // allowed (or no allowlist configured) -> fall through to render admin
    } else {
    // Check role from the application's users table (public.users)
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as string | undefined;

    if (profileError || !profile || role !== "admin") {
      return (
        <main className="p-8 min-h-screen flex items-center justify-center">
          <div className="max-w-xl w-full text-center bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold mb-2">Not authorized</h1>
            <p className="text-sm text-muted-foreground">You do not have permission to access the admin area.</p>
          </div>
        </main>
      );
    }
    }
  } catch {
    return (
      <main className="p-8 min-h-screen flex items-center justify-center">
        <div className="max-w-xl w-full text-center bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-2">Not authorized</h1>
          <p className="text-sm text-muted-foreground">You do not have permission to access the admin area.</p>
        </div>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
