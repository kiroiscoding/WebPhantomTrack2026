import { Suspense } from "react";
import type { Metadata } from "next";
import AddClient from "./AddClient";

const OG_IMAGE = "https://esdreacrlfzyitatvyhs.supabase.co/storage/v1/object/public/og/og-preview.png";

export const metadata: Metadata = {
    title: "Add me on Phantom Track",
    description: "Scan to add me on Phantom Track — the soccer performance wearable.",
    openGraph: {
        title: "Add me on Phantom Track",
        description: "Scan to add me on Phantom Track — the soccer performance wearable.",
        images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Add me on Phantom Track",
        description: "Scan to add me on Phantom Track.",
        images: [OG_IMAGE],
    },
};

export default function AddPage() {
    return (
        <Suspense>
            <AddClient />
        </Suspense>
    );
}
