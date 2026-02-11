import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { userHasAdminAccess } from "@/lib/admin";
import { AdminCustomersClient } from "./AdminCustomersClient";

export default async function AdminCustomersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!userHasAdminAccess(user)) notFound();

  return <AdminCustomersClient />;
}

