export function buildWaitlistConfirmationEmail(params: {
    email: string;
    brandName: string;
}) {
    const PRIMARY = "#a855f7";
    const BG = "#050505";
    const CARD = "rgba(255,255,255,0.06)";
    const BORDER = "rgba(255,255,255,0.12)";
    const TEXT = "#ededed";
    const MUTED = "rgba(237,237,237,0.7)";

    const preheader = `You're on the ${params.brandName} waitlist — we'll let you know when it drops.`;

    const html = `
    <!doctype html>
    <html>
      <body style="margin:0; padding:0; background:${BG}; color:${TEXT};">
        <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${preheader}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG}; padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px; max-width:600px;">
                <tr>
                  <td style="padding:8px 6px 18px; color:${TEXT}; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                    <div style="font-weight:900; letter-spacing:-0.03em; font-size:20px;">
                      ${params.brandName}<span style="color:${PRIMARY};">.</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="border:1px solid ${BORDER}; background:${CARD}; border-radius:28px; padding:28px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                    <div style="font-size:28px; font-weight:900; letter-spacing:-0.04em; margin:0 0 12px;">
                      You're on the list<span style="color:${PRIMARY};">.</span>
                    </div>
                    <div style="color:${MUTED}; font-size:15px; line-height:1.6; margin:0 0 20px;">
                      Thanks for joining the ${params.brandName} waitlist. We're putting the finishing touches on something special — you'll be the first to know when it's ready.
                    </div>

                    <div style="margin-top:18px; padding:16px; border:1px solid ${BORDER}; border-radius:18px; background:rgba(0,0,0,0.25);">
                      <div style="color:${MUTED}; font-size:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; text-transform:uppercase; letter-spacing:0.14em; margin-bottom:6px;">
                        What's next
                      </div>
                      <div style="color:${TEXT}; font-size:14px; line-height:1.6;">
                        We'll send you an email the moment ${params.brandName} is available. No spam, just the drop.
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 6px 0; color:${MUTED}; font-size:12px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
                    You signed up with ${params.email}. If this wasn't you, just ignore this email.
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
        `You're on the ${params.brandName} waitlist.`,
        "",
        `Thanks for joining. We're putting the finishing touches on something special — you'll be the first to know when it's ready.`,
        "",
        `We'll send you an email the moment ${params.brandName} is available. No spam, just the drop.`,
        "",
        `You signed up with ${params.email}.`,
        "",
        `— ${params.brandName}`,
    ].join("\n");

    return {
        subject: `You're on the waitlist — ${params.brandName}`,
        html,
        text,
    };
}
