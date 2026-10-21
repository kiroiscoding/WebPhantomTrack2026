import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ReviewMorphGallery, type GalleryReview, type GallerySlide } from "@/components/ReviewMorphGallery";

export const APP_STORE_REVIEWS_URL =
    "https://apps.apple.com/us/app/6758968140?see-all=reviews&platform=iphone";

type AppStoreReview = {
    title: string;
    text: string;
    author: string;
    date: string;
    rating: number;
};

// Verbatim from the App Store listing (id6758968140). Do not edit the wording.
const REVIEWS: AppStoreReview[] = [
    {
        title: "Amazing!",
        text: "The 3D heat map feature is honestly one of the coolest things about Phantom Track. Instead of just showing a flat heat map, it turns your movement data into a 3D bar graph across the field. The areas where you spent more time actually rise up like peaks, which makes it super easy to understand your positioning and work rate. Seeing my runs and movement visualized like that helped me realize where I’m drifting too wide and where I should be more active. It’s such a smart way to turn raw data into something players can actually learn from.",
        author: "klockioli",
        date: "Mar 14, 2026",
        rating: 5,
    },
    {
        title: "Phenomenal App",
        text: "The setup process is really simple and the UI is super clean. Connecting the tracker to the app takes just a few seconds, and syncing data before games or practices is basically effortless. I can just turn the device on, open the app, and it’s ready. The interface is easy to navigate and everything is where you expect it to be, which makes it great when you’re trying to quickly check stats before or after a match.",
        author: "Borsok ulan",
        date: "Mar 14, 2026",
        rating: 5,
    },
    {
        title: "Amazing!",
        text: "This is an amazing product. I purchased this for my son to use and he absolutely loves it. He uses the app to improve his skill and track his stats. He has recommended the app and product to his friends. They have really enjoyed using it as well!",
        author: "unicornsjuju",
        date: "Feb 26, 2026",
        rating: 5,
    },
];

const appStore = (r: AppStoreReview): GalleryReview => ({
    title: r.title,
    text: r.text,
    author: r.author,
    meta: r.date,
    source: "app-store",
});

const quote = (text: string, author: string, role: string): GalleryReview => ({
    text,
    author,
    meta: role,
});

const photo = (name: string, alt: string) => ({
    src: `/gallery/${name}.jpg`,
    thumb: `/gallery/thumb/${name}.jpg`,
    alt,
});

// One review per photo. Outdoor shoot grades (vibrant / moody / golden hour)
// alternate with the indoor facility shots; no black-and-white.
const SLIDES: GallerySlide[] = [
    { review: appStore(REVIEWS[0]), photo: photo("shoot-01", "Vibrant outdoor action shot") },
    { review: quote("My performance has measurably improved since using this.", "Daiven T.", "Right Mid"), photo: photo("indoor-01", "Player training indoors") },
    { review: quote("A total shift in perspective.", "Alex M.", "Pro Athlete"), photo: photo("shoot-03", "Golden hour outdoor shot") },
    { review: appStore(REVIEWS[1]), photo: photo("indoor-03", "Player dribbling on the indoor turf") },
    { review: quote("Game-changing data right at your fingertips.", "Timi A.", "Midfielder"), photo: photo("shoot-04", "Moody outdoor action shot") },
    { review: quote("Clear data, zero noise. Exactly what players need.", "Ethan J.", "Academy Coach"), photo: photo("indoor-06", "Heading drill indoors") },
    { review: appStore(REVIEWS[2]), photo: photo("shoot-05", "Vibrant outdoor action shot") },
    { review: quote("My top speed and sprint count keep climbing since I started tracking.", "Eashan C.", "Striker"), photo: photo("indoor-02", "Player on the indoor pitch") },
    { review: quote("Workload trends make recovery decisions way smarter.", "Omar H.", "Strength Coach"), photo: photo("shoot-08", "Golden hour action shot") },
    { review: quote("Session comparisons week-to-week are so valuable.", "Oliver S.", "Holding Mid"), photo: photo("indoor-04", "Two players training indoors") },
    { review: quote("Love how simple it is to review sessions.", "Will G.", "Defender"), photo: photo("shoot-06", "Moody outdoor action shot") },
    { review: quote("Best investment I've made for my football development.", "Ryan A.", "Centre Mid"), photo: photo("indoor-05", "Squad lined up in front of the goal") },
];

export function SocialProof() {
    return (
        <section id="reviews" className="py-24 bg-[#050505] overflow-hidden relative">
            <div className="mx-auto max-w-[1400px] px-5 md:px-8">

                {/* Headline */}
                <div className="mb-14 md:mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        TRUSTED BY <span className="text-primary">BALLERS</span>
                    </h2>

                    {/* Partner strip — same visual language as the programs logo rows */}
                    <div className="mt-8 md:mt-10 flex flex-col items-center gap-3">
                        <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                            Partnered with
                        </p>
                        <div className="flex items-center gap-3.5 md:gap-4 px-4 py-2 opacity-85">
                            <span className="relative block h-12 w-12 md:h-14 md:w-14 shrink-0">
                                <Image
                                    src="/Logos/european-sports.png"
                                    alt=""
                                    fill
                                    sizes="56px"
                                    className="object-contain"
                                />
                            </span>
                            <span className="relative block h-7 w-[140px] md:h-8 md:w-[168px]">
                                <Image
                                    src="/Logos/european-sports-wordmark-white.png"
                                    alt="European Sports"
                                    fill
                                    sizes="168px"
                                    className="object-contain object-left"
                                />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Photos and reviews, dissolving into each other */}
                <ReviewMorphGallery slides={SLIDES} />

                <div className="mt-10 text-center">
                    <a
                        href={APP_STORE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-white/10"
                    >
                        Read all reviews on the App Store
                        <ArrowUpRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
