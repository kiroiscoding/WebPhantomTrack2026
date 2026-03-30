import { Suspense } from "react";
import type { Metadata } from "next";
import InviteClient from "./InviteClient";

const OG_IMAGE = "https://esdreacrlfzyitatvyhs.supabase.co/storage/v1/object/public/og/og-preview.png";

export const metadata: Metadata = {
    title: "You've been invited to Phantom Track",
    description: "Your teammate wants to connect on Phantom Track — the soccer performance wearable.",
    openGraph: {
        title: "You've been invited to Phantom Track",
        description: "Your teammate wants to connect on Phantom Track — the soccer performance wearable.",
        images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "You've been invited to Phantom Track",
        description: "Your teammate wants to connect on Phantom Track.",
        images: [OG_IMAGE],
    },
};

export default function InvitePage() {
    return (
        <Suspense>
            <InviteClient />
        </Suspense>
    );
}
