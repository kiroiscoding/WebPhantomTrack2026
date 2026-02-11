export type ShippoAddress = {
  name?: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
};

export type ShippoParcel = {
  length: string;
  width: string;
  height: string;
  distance_unit: "in" | "cm";
  weight: string;
  mass_unit: "lb" | "kg" | "oz" | "g";
};

export function requireShippoToken(): string {
  const token = process.env.SHIPPO_API_TOKEN;
  if (!token) throw new Error("Missing SHIPPO_API_TOKEN");
  return token;
}

export function requireShippoWebhookSecret(): string {
  const s = process.env.SHIPPO_WEBHOOK_SECRET;
  if (!s) throw new Error("Missing SHIPPO_WEBHOOK_SECRET");
  return s;
}

export function parseJsonEnv<T>(key: string): T {
  const raw = process.env[key];
  if (!raw) throw new Error(`Missing ${key}`);
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Invalid JSON in ${key}`);
  }
}

export async function shippoRequest<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const token = init?.token ?? requireShippoToken();
  const res = await fetch(`https://api.goshippo.com${path}`, {
    ...init,
    headers: {
      Authorization: `ShippoToken ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shippo API error (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

