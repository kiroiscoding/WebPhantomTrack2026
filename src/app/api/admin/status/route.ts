import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserRole, userHasAdminAccess, userIsAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return NextResponse.json({
    isAdmin: userHasAdminAccess(user),
    isSuperAdmin: userIsAdmin(user),
    role: getUserRole(user),
  });
}

