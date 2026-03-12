import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { buildWaitlistConfirmationEmail } from "@/lib/waitlistEmail";

const FAKE_BASE = 23;

export async function GET() {
    try {
        const supabase = createSupabaseAdminClient();
        const { count, error } = await supabase
            .from("waitlist")
            .select("*", { count: "exact", head: true });

        if (error) {
            return NextResponse.json({ count: FAKE_BASE }, { status: 200 });
        }

        return NextResponse.json({ count: FAKE_BASE + (count ?? 0) });
    } catch {
        return NextResponse.json({ count: FAKE_BASE }, { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = (body.email ?? "").trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
        }

        const supabase = createSupabaseAdminClient();

        const { data: existing } = await supabase
            .from("waitlist")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (existing) {
            const { count } = await supabase
                .from("waitlist")
                .select("*", { count: "exact", head: true });

            return NextResponse.json({
                message: "You're already on the list!",
                count: FAKE_BASE + (count ?? 0),
                alreadyJoined: true,
            });
        }

        const { error: insertError } = await supabase
            .from("waitlist")
            .insert({ email });

        if (insertError) {
            console.error("Waitlist insert error:", insertError);
            return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
        }

        if (isEmailConfigured()) {
            try {
                const brandName = process.env.BRAND_NAME ?? "Phantom Track";
                const { subject, html, text } = buildWaitlistConfirmationEmail({ email, brandName });
                await sendEmail({ to: email, subject, html, text });
            } catch (emailErr) {
                console.error("Waitlist confirmation email failed:", emailErr);
            }
        }

        const { count } = await supabase
            .from("waitlist")
            .select("*", { count: "exact", head: true });

        return NextResponse.json({
            message: "You're in! Check your inbox.",
            count: FAKE_BASE + (count ?? 0),
            alreadyJoined: false,
        });
    } catch {
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
