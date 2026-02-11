// Human-friendly order reference for UI/emails (keeps real UUID internally).
// Example: PT-3F7A1C2B
export function formatOrderRef(id?: string | null) {
  if (!id) return "PT-UNKNOWN";
  const compact = String(id).replace(/-/g, "").toUpperCase();
  const short = compact.slice(0, 8) || "UNKNOWN";
  return `PT-${short}`;
}

