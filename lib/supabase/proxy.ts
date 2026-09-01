import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isSuperadminRoute = pathname.startsWith("/superadmin");

  // Only bother checking role if the route actually needs protection
  if (isAdminRoute || isSuperadminRoute) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    // No recognized staff role at all — kick to login
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin trying to reach superadmin pages -> bounce to their own area
    if (isSuperadminRoute && role !== "superadmin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Superadmin trying to reach admin pages -> bounce to their own area
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/superadmin", request.url));
    }
  }

  return response;
}