"use client";

import { useSyncExternalStore } from "react";

export type DevicePlatform = "ios" | "android";

// Android phones and tablets see the Android app screenshots; everyone else
// (iPhone, iPad, desktop) sees the iOS ones.
function detectPlatform(): DevicePlatform {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const ua = `${nav.userAgentData?.platform ?? ""} ${nav.userAgent}`;
    return /android/i.test(ua) ? "android" : "ios";
}

const subscribe = () => () => {};

/**
 * The visitor's platform, or `null` during server render and hydration, so
 * callers can wait before loading either screenshot set.
 */
export function useDevicePlatform(): DevicePlatform | null {
    return useSyncExternalStore(subscribe, detectPlatform, () => null);
}

const SCREENSHOT_DIRS: Record<DevicePlatform, string> = {
    ios: "/app/new-screenshots",
    android: "/app/android-screenshots",
};

/** Path to an app screenshot such as `home.png` for the given platform. */
export function appScreenshot(platform: DevicePlatform, file: string): string {
    return `${SCREENSHOT_DIRS[platform]}/${file}`;
}
