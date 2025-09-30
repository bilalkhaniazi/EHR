import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    if (!req.nextUrl.pathname.startsWith("/auth/signin") && !req.nextUrl.pathname.startsWith("/auth/signup")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return res;
  }

  if (session) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role === "admin" && !req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (profile?.role !== "admin" && !req.nextUrl.pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
