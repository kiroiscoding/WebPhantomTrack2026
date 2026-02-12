import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");

  const safeNext =
    typeof nextParam === "string" && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/account";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth callback error:", error.message);
      // Redirect with an error hint so the UI can surface it
      const errUrl = new URL(safeNext, url.origin);
      errUrl.searchParams.set("auth_error", error.message);
      return NextResponse.redirect(errUrl);
    }
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}

