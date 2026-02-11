import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "favicon.png");
  const bytes = await readFile(filePath);

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      // Avoid stubborn favicon caching during dev/initial rollout.
      "Cache-Control": "no-store",
    },
  });
}

