import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AdminRole } from "@/lib/admin";
import { userIsAdmin } from "@/lib/admin";

export const runtime = "nodejs";

type Body = { email?: string; role?: AdminRole };

export async function POST(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.id) return new NextResponse("Not signed in", { status: 401 });
    if (!userIsAdmin(user)) return new NextResponse("Forbidden", { status: 403 });

    const body = (await request.json()) as Body;
    const email = (body.email || "").trim().toLowerCase();
    const role = body.role;
    if (!email) return new NextResponse("Missing email", { status: 400 });
    if (role !== "admin" && role !== "staff") return new NextResponse("Invalid role", { status: 400 });

    const admin = createSupabaseAdminClient();

    let found: { id: string; app_metadata: Record<string, unknown> } | null = null;
    let page = 1;
    const perPage = 200;

    for (let i = 0; i < 10; i++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) return new NextResponse(error.message, { status: 500 });

      const users = data?.users ?? [];
      for (const u of users) {
        if ((u.email || "").toLowerCase() === email) {
          found = { id: u.id, app_metadata: (u.app_metadata ?? {}) as Record<string, unknown> };
          break;
        }
      }
      if (found) break;
      if (users.length < perPage) break;
      page += 1;
    }

    if (!found) return new NextResponse("User not found", { status: 404 });

    const nextMeta = { ...(found.app_metadata ?? {}), role };
    const updated = await admin.auth.admin.updateUserById(found.id, { app_metadata: nextMeta });
    if (updated.error) return new NextResponse(updated.error.message, { status: 500 });

    return NextResponse.json({ ok: true, userId: found.id, role });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update user role";
    return new NextResponse(message, { status: 500 });
  }
}

