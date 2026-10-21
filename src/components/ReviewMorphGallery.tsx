"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import MorphGallery, { type MorphItem } from "@/components/ui/morph-gallery";

export type GalleryReview = {
    text: string;
    author: string;
    /** Role/position line, or the review date for App Store reviews. */
    meta: string;
    title?: string;
    source?: "app-store";
};

export type GallerySlide = {
    review: GalleryReview;
    photo: { src: string; thumb: string; alt: string };
};

const arrowClass =
    "flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white " +
    "transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Review text beside a photo; the arrows move both, and the photo dissolves. */
export function ReviewMorphGallery({ slides }: { slides: GallerySlide[] }) {
    const [index, setIndex] = React.useState(0);
    const n = slides.length;
    const go = (i: number) => setIndex(((i % n) + n) % n);

    const items: MorphItem[] = React.useMemo(
        () => slides.map((s) => s.photo),
        [slides],
    );
    const { review } = slides[index];

    return (
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
            {/* Text */}
            <div className="order-2 flex flex-col md:order-1">
                <div
                    key={index}
                    className="min-h-[280px] animate-[fadeUp_900ms_ease-out] md:min-h-[360px]"
                    aria-live="polite"
                >
                    <div
                        className="mb-5 flex gap-1"
                        role="img"
                        aria-label="5 out of 5 stars"
                    >
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
                        ))}
                    </div>
                    {review.title && (
                        <h3 className="mb-3 text-2xl font-bold leading-tight text-white md:text-3xl">
                            {review.title}
                        </h3>
                    )}
                    <p
                        className={
                            review.source === "app-store"
                                ? "text-base leading-relaxed text-white/75 md:text-lg"
                                : "text-2xl font-semibold leading-snug text-white md:text-4xl"
                        }
                    >
                        {review.source === "app-store" ? review.text : `“${review.text}”`}
                    </p>
                    <div className="mt-6 border-t border-white/10 pt-4">
                        <div className="text-base font-bold text-white">{review.author}</div>
                        <div className="text-xs uppercase tracking-wider text-white/50">
                            {review.source === "app-store"
                                ? `${review.meta} · App Store review`
                                : review.meta}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <button type="button" className={arrowClass} onClick={() => go(index - 1)} aria-label="Previous review">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button type="button" className={arrowClass} onClick={() => go(index + 1)} aria-label="Next review">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="ml-2 text-sm tabular-nums text-white/40">
                        {index + 1} / {n}
                    </span>
                </div>
            </div>

            {/* Photo */}
            <div
                className="relative order-1 mx-auto w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] shadow-2xl md:order-2"
                style={{ maxWidth: "min(100%, 640px)", aspectRatio: "1 / 1" }}
            >
                <MorphGallery
                    items={items}
                    height="100%"
                    index={index}
                    onIndexChange={setIndex}
                    arrows={false}
                    thumbnails={false}
                    autoplay={0}
                    duration={1100}
                    className="rounded-[28px]"
                />
            </div>
        </div>
    );
}
