type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

import { formatOrderRef } from "@/lib/orderRef";

function env(name: string): string | null {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

export function isEmailConfigured(): boolean {
  return Boolean(env("SMTP_HOST") && env("SMTP_PORT") && env("SMTP_USER") && env("SMTP_PASS"));
}

export async function sendEmail(args: SendEmailArgs) {
  const host = env("SMTP_HOST");
  const portRaw = env("SMTP_PORT");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  const from = env("EMAIL_FROM") ?? user;
  const secure = (env("SMTP_SECURE") ?? "true").toLowerCase() === "true";

  if (!host || !portRaw || !user || !pass) {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally EMAIL_FROM, SMTP_SECURE)."
    );
  }

  const port = Number(portRaw);
  if (Number.isNaN(port)) throw new Error("Invalid SMTP_PORT");

  type NodemailerTransporter = { sendMail: (mail: Record<string, unknown>) => Promise<unknown> };
  type NodemailerModule = { createTransport: (opts: Record<string, unknown>) => NodemailerTransporter };

  const isNodemailerModule = (v: unknown): v is NodemailerModule => {
    if (!v || typeof v !== "object") return false;
    return typeof (v as Record<string, unknown>).createTransport === "function";
  };

  let nodemailer: NodemailerModule;
  try {
    const mod = (await import("nodemailer")) as unknown as { default?: unknown };
    const candidate = (mod.default ?? mod) as unknown;
    if (!isNodemailerModule(candidate)) throw new Error("Invalid nodemailer module shape");
    nodemailer = candidate;
  } catch {
    throw new Error('Missing dependency "nodemailer". Run `npm install`.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  } as unknown as Record<string, unknown>);

  await transporter.sendMail({
    from: from ?? undefined,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  } as unknown as Record<string, unknown>);
}

export function buildOrderConfirmationEmail(params: {
  brandName: string;
  orderId: string;
  orderUrl?: string | null;
  customerName?: string | null;
  customerEmail: string;
  amount?: string | null;
  items: { description: string; quantity: number }[];
  shippingAddressLines: string[];
}) {
  const orderRef = formatOrderRef(params.orderId);
  const PRIMARY = "#a855f7";
  const BG = "#050505";
  const CARD = "rgba(255,255,255,0.06)";
  const BORDER = "rgba(255,255,255,0.12)";
  const TEXT = "#ededed";
  const MUTED = "rgba(237,237,237,0.7)";
  const safeItems = params.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:10px 0; border-top:1px solid ${BORDER}; color:${TEXT};">
            <span style="font-weight:700;">${escapeHtml(i.description)}</span>
            <span style="color:${MUTED};"> × ${Number(i.quantity || 1)}</span>
          </td>
        </tr>`
    )
    .join("");
  const addr = params.shippingAddressLines.map((l) => escapeHtml(l)).join("<br/>");
  const orderLink = params.orderUrl
    ? `<a href="${params.orderUrl}" style="display:inline-block; background:${PRIMARY}; color:#ffffff; text-decoration:none; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; font-size:12px; padding:14px 18px; border-radius:999px;">View order</a>`
    : "";

  const preheader = `Thanks for your order${params.customerName ? `, ${params.customerName}` : ""} — we’re on it.`;

  const html = `
  <!doctype html>
  <html>
    <body style="margin:0; padding:0; background:${BG}; color:${TEXT};">
      <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(preheader)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG}; padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px; max-width:600px;">
              <tr>
                <td style="padding:8px 6px 18px; color:${TEXT}; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                  <div style="font-weight:900; letter-spacing:-0.03em; font-size:20px;">
                    ${escapeHtml(params.brandName)}<span style="color:${PRIMARY};">.</span>
                  </div>
                  <div style="color:${MUTED}; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                    Order confirmation
                  </div>
                </td>
              </tr>

              <tr>
                <td style="border:1px solid ${BORDER}; background:${CARD}; border-radius:28px; padding:22px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                  <div style="font-size:26px; font-weight:900; letter-spacing:-0.04em; margin:0 0 8px;">
                    Thanks for your order${params.customerName ? `, ${escapeHtml(params.customerName)}` : ""}.
                  </div>
                  <div style="color:${MUTED}; font-size:14px; margin:0 0 16px;">
                    We’ve received your order and will start processing it right away.
                  </div>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;">
                    <tr>
                      <td style="color:${MUTED}; font-size:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; text-transform:uppercase; letter-spacing:0.14em;">
                        Order #
                      </td>
                    </tr>
                    <tr>
                      <td style="color:${TEXT}; font-weight:800; word-break:break-all;">
                        ${escapeHtml(orderRef)}
                      </td>
                    </tr>
                    ${
                      params.amount
                        ? `<tr><td style="padding-top:10px; color:${MUTED}; font-size:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; text-transform:uppercase; letter-spacing:0.14em;">Total</td></tr>
                           <tr><td style="color:${TEXT}; font-weight:800;">${escapeHtml(params.amount)}</td></tr>`
                        : ""
                    }
                  </table>

                  <div style="margin-top:18px; padding-top:16px; border-top:1px solid ${BORDER};">
                    <div style="color:${MUTED}; font-size:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:8px;">
                      Items
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      ${safeItems || `<tr><td style="padding:10px 0; border-top:1px solid ${BORDER}; color:${MUTED};">—</td></tr>`}
                    </table>
                  </div>

                  <div style="margin-top:18px; padding-top:16px; border-top:1px solid ${BORDER};">
                    <div style="color:${MUTED}; font-size:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:8px;">
                      Shipping address
                    </div>
                    <div style="color:${TEXT}; font-size:14px; line-height:1.5;">
                      ${addr || "<span style='color:" + MUTED + ";'>—</span>"}
                    </div>
                  </div>

                  ${
                    orderLink
                      ? `<div style="margin-top:22px;">${orderLink}</div>`
                      : ""
                  }
                </td>
              </tr>

              <tr>
                <td style="padding:14px 6px 0; color:${MUTED}; font-size:12px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                  If you have any questions, just reply to this email.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `.trim();

  const text = [
    `Thanks for your order${params.customerName ? `, ${params.customerName}` : ""}.`,
    "",
    `Order #: ${orderRef}${params.amount ? ` (Total: ${params.amount})` : ""}`,
    "",
    "Items:",
    ...(params.items.length ? params.items.map((i) => `- ${i.description} x${i.quantity}`) : ["- —"]),
    "",
    "Shipping address:",
    ...(params.shippingAddressLines.length ? params.shippingAddressLines : ["—"]),
    ...(params.orderUrl ? ["", `View your order: ${params.orderUrl}`] : []),
    "",
    `Thank you,`,
    params.brandName,
  ].join("\n");

  return { subject: `Order confirmation — ${params.brandName}`, html, text };
}

export function buildShippingNotificationEmail(params: {
  brandName: string;
  orderId: string;
  orderUrl?: string | null;
  customerName?: string | null;
  customerEmail: string;
  trackingNumber: string;
  trackingUrl?: string | null;
  carrier?: string | null;
}) {
  const orderRef = formatOrderRef(params.orderId);
  const PRIMARY = "#a855f7";
  const BG = "#050505";
  const CARD = "rgba(255,255,255,0.06)";
  const BORDER = "rgba(255,255,255,0.12)";
  const TEXT = "#ededed";
  const MUTED = "rgba(237,237,237,0.7)";

  const preheader = `Your order is on the way — tracking ${params.trackingNumber}.`;

  const orderButton = params.orderUrl
    ? `<a href="${params.orderUrl}" style="display:inline-block; background:transparent; border:1px solid ${BORDER}; color:${TEXT}; text-decoration:none; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; font-size:12px; padding:14px 18px; border-radius:999px;">View order</a>`
    : "";
  const trackButton = params.trackingUrl
    ? `<a href="${params.trackingUrl}" style="display:inline-block; background:${PRIMARY}; color:#ffffff; text-decoration:none; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; font-size:12px; padding:14px 18px; border-radius:999px;">Track package</a>`
    : "";

  const html = `
  <!doctype html>
  <html>
    <body style="margin:0; padding:0; background:${BG}; color:${TEXT};">
      <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(preheader)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG}; padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px; max-width:600px;">
              <tr>
                <td style="padding:8px 6px 18px; color:${TEXT}; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                  <div style="font-weight:900; letter-spacing:-0.03em; font-size:20px;">
                    ${escapeHtml(params.brandName)}<span style="color:${PRIMARY};">.</span>
                  </div>
                  <div style="color:${MUTED}; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                    Shipping update
                  </div>
                </td>
              </tr>

              <tr>
                <td style="border:1px solid ${BORDER}; background:${CARD}; border-radius:28px; padding:22px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                  <div style="font-size:26px; font-weight:900; letter-spacing:-0.04em; margin:0 0 8px;">
                    Your order is on the way${params.customerName ? `, ${escapeHtml(params.customerName)}` : ""}.
                  </div>
                  <div style="color:${MUTED}; font-size:14px; margin:0 0 16px;">
                    We just shipped your order. Thanks again for supporting ${escapeHtml(params.brandName)}.
                  </div>

                  <div style="margin-top:12px; padding:16px; border:1px solid ${BORDER}; border-radius:18px; background:rgba(0,0,0,0.25);">
                    <div style="color:${MUTED}; font-size:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:6px;">
                      Tracking
                    </div>
                    <div style="color:${TEXT}; font-weight:900; font-size:16px; word-break:break-all;">
                      ${escapeHtml(params.trackingNumber)}
                    </div>
                    <div style="color:${MUTED}; margin-top:6px;">
                      Carrier: ${escapeHtml(params.carrier || "—")}
                    </div>
                  </div>

                  <div style="margin-top:22px;">
                    ${trackButton ? trackButton : ""}
                    ${trackButton && orderButton ? `<span style="display:inline-block; width:10px;"></span>` : ""}
                    ${orderButton ? orderButton : ""}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:14px 6px 0; color:${MUTED}; font-size:12px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                  Order #: ${escapeHtml(orderRef)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `.trim();

  const text = [
    `Your order is on the way${params.customerName ? `, ${params.customerName}` : ""}.`,
    "",
    `Order #: ${orderRef}`,
    `Carrier: ${params.carrier || "—"}`,
    `Tracking #: ${params.trackingNumber}`,
    ...(params.trackingUrl ? [`Track: ${params.trackingUrl}`] : []),
    ...(params.orderUrl ? [`View order: ${params.orderUrl}`] : []),
    "",
    `Thank you,`,
    params.brandName,
  ].join("\n");

  return { subject: `Your order is on the way — ${params.brandName}`, html, text };
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

