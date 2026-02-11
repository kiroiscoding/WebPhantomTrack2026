import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { userHasAdminAccess } from "@/lib/admin";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0] || "";
  const isAdminHost = hostname === "admin" || hostname.startsWith("admin.");

  const nextUrl = request.nextUrl.clone();

  // If admin subdomain, rewrite to /admin/* routes.
  if (isAdminHost) {
    if (nextUrl.pathname === "/") {
      nextUrl.pathname = "/admin";
      nextUrl.searchParams.delete("next");
    } else if (
      !nextUrl.pathname.startsWith("/admin") &&
      !nextUrl.pathname.startsWith("/_next") &&
      !nextUrl.pathname.startsWith("/api") &&
      !nextUrl.pathname.startsWith("/auth")
    ) {
      nextUrl.pathname = `/admin${nextUrl.pathname}`;
    }
  }

  const response = isAdminHost ? NextResponse.rewrite(nextUrl) : NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anon) return response;

  const supabase = createServerClient(supabaseUrl, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session if present (keeps cookies in sync).
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const path = (isAdminHost ? nextUrl.pathname : request.nextUrl.pathname) || "/";
  const isAdminPage = path === "/admin" || path.startsWith("/admin/");
  const isAdminLogin = path === "/admin/login";
  const isAdminApi = path.startsWith("/api/admin");

  if ((isAdminPage && !isAdminLogin) || isAdminApi) {
    if (!user) {
      if (isAdminApi) return new NextResponse("Not signed in", { status: 401 });
      const next = encodeURIComponent(path + (request.nextUrl.search || ""));
      return NextResponse.redirect(new URL(`/admin/login?next=${next}`, request.url));
    }
    if (!userHasAdminAccess(user)) {
      if (isAdminApi) return new NextResponse("Forbidden", { status: 403 });
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/404";
      notFoundUrl.search = "";
      return NextResponse.rewrite(notFoundUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

