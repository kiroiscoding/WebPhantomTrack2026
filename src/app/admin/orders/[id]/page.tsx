import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { userHasAdminAccess } from "@/lib/admin";
import { AdminOrderDetailClient } from "./AdminOrderDetailClient";

export default async function AdminOrderDetailPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  // Return a true 404 for non-admins (security by non-discoverability).
  if (!userHasAdminAccess(user)) notFound();

  return <AdminOrderDetailClient />;
}

