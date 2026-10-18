import React from "react";
import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";

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

                {/* App Store reviews */}
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {REVIEWS.map((review) => (
                        <li
                            key={review.author}
                            className="bg-[#111111] border border-white/12 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] flex flex-col shadow-xl"
                        >
                            <div
                                className="flex gap-1 mb-4"
                                role="img"
                                aria-label={`${review.rating} out of 5 stars`}
                            >
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" aria-hidden="true" />
                                ))}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-3">
                                {review.title}
                            </h3>
                            <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">
                                {review.text}
                            </p>
                            <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                                <div>
                                    <div className="text-sm sm:text-base font-bold text-white">{review.author}</div>
                                    <div className="text-xs text-white/50">{review.date}</div>
                                </div>
                                <div className="text-[11px] text-white/40 uppercase tracking-wider">
                                    App Store review
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

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
