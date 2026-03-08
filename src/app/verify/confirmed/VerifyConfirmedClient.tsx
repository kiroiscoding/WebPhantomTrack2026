"use client";

import { useEffect, useMemo, useState } from "react";

type SearchParams = Record<string, string | string[] | undefined>;
type VerificationStatus = "success" | "error" | "missing_params";

const SUPABASE_KEYS = [
  "code",
  "token_hash",
  "type",
  "access_token",
  "refresh_token",
  "error",
  "error_code",
  "error_description",
] as const;

type SupabaseKey = (typeof SUPABASE_KEYS)[number];
type ParsedParams = Partial<Record<SupabaseKey, string>>;

function getFirstValue(value: string | string[] | null | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

function pickKnownParams(values: URLSearchParams | SearchParams): ParsedParams {
  const out: ParsedParams = {};
  for (const key of SUPABASE_KEYS) {
    let value: string | undefined;
    if (values instanceof URLSearchParams) {
      value = values.get(key) ?? undefined;
    } else {
      value = getFirstValue(values[key]);
    }
    if (value) out[key] = value;
  }
  return out;
}

function parseHashToParams(hash: string): URLSearchParams {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return new URLSearchParams();

  const queryIndex = raw.indexOf("?");
  if (queryIndex >= 0) {
    return new URLSearchParams(raw.slice(queryIndex + 1));
  }

  return new URLSearchParams(raw);
}

function deriveStatus(params: ParsedParams): VerificationStatus {
  if (params.error || params.error_code || params.error_description) return "error";
  if (params.code || params.token_hash || params.type || params.access_token || params.refresh_token) {
    return "success";
  }
  return "missing_params";
}

export function VerifyConfirmedClient({ searchParams }: { searchParams: SearchParams }) {
  const queryParams = useMemo(() => pickKnownParams(searchParams), [searchParams]);
  const [hashParams, setHashParams] = useState<ParsedParams>({});

  useEffect(() => {
    try {
      const parsedHash = parseHashToParams(window.location.hash);
      setHashParams(pickKnownParams(parsedHash));
    } catch {
      setHashParams({});
    }
  }, []);

  const mergedParams = useMemo(() => ({ ...queryParams, ...hashParams }), [queryParams, hashParams]);
  const status = useMemo(() => deriveStatus(mergedParams), [mergedParams]);
  const isError = status === "error";
  const hasRecognizedParams = status !== "missing_params";

  useEffect(() => {
    try {
      console.info("[verify/confirmed]", {
        status,
        hasQueryOrHashParams: hasRecognizedParams,
        type: mergedParams.type ?? null,
        errorCode: mergedParams.error_code ?? null,
      });
    } catch {
      // keep this route fully non-blocking even if logging fails
    }
  }, [hasRecognizedParams, mergedParams.error_code, mergedParams.type, status]);

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white sm:px-8">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-sm sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isError ? "Verification link invalid or expired" : "Email confirmed"}
          </h1>

          {isError ? (
            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              This verification link is no longer valid. Please request a new confirmation email from
              the app and try again.
            </p>
          ) : (
            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              Email confirmed. Return to Phantom Track app.
            </p>
          )}

          {!hasRecognizedParams && !isError && (
            <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
              If you already confirmed, just return to the app.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="phantomtrack://auth-callback"
              className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200 sm:text-base"
            >
              Open Phantom Track app
            </a>
            <p className="text-sm text-white/60 sm:text-base">Return to the app manually.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
