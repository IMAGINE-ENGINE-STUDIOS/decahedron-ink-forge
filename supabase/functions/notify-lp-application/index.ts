const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';
const NOTIFY_TO = 'info@decahedronventures.com';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function encodeHeader(value: string) {
  // RFC 2047 encoding so unicode subjects survive
  return /^[\x20-\x7E]*$/.test(value)
    ? value
    : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(value)))}?=`;
}

function createRawEmail(to: string, subject: string, html: string, replyTo?: string) {
  const lines = [
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    'X-Decahedron-Notification: lp-application',
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    html,
  ].join('\r\n');
  const bytes = new TextEncoder().encode(lines);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GOOGLE_MAIL_API_KEY = Deno.env.get('GOOGLE_MAIL_API_KEY');
    if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
      throw new Error('LOVABLE_API_KEY and GOOGLE_MAIL_API_KEY must be configured');
    }

    const body = await req.json().catch(() => ({}));
    const full_name = String(body.full_name ?? '').trim();
    const email = String(body.email ?? '').trim();
    if (!full_name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid full_name and email are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const company = String(body.company_name ?? '').trim();
    const title = String(body.job_title ?? '').trim();
    const ticket = String(body.investment_amount ?? '').trim();
    const message = String(body.message ?? '').trim().slice(0, 4000);
    const source = String(body.source ?? 'LP Brochure — Contact Sheet').trim().slice(0, 120);

    const subject = `[LP APPLICATION] ${full_name}${company ? ` — ${company}` : ''}${ticket ? ` — ${ticket}` : ''}`;

    const row = (k: string, v: string) =>
      v
        ? `<tr><td style="padding:6px 14px 6px 0;color:#8a8a8a;font:12px/1.4 -apple-system,Segoe UI,sans-serif;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#111;font:14px/1.5 -apple-system,Segoe UI,sans-serif">${esc(v)}</td></tr>`
        : '';

    const html = `<div style="max-width:640px;font-family:-apple-system,Segoe UI,sans-serif">
  <div style="border-left:4px solid #c98a2b;padding:6px 0 6px 12px;margin-bottom:16px">
    <div style="font:11px/1.4 monospace;letter-spacing:.25em;color:#c98a2b">DECAHEDRON VENTURES</div>
    <div style="font:20px/1.3 Georgia,serif;color:#111;margin-top:4px">New Limited Partner Application</div>
  </div>
  <table style="border-collapse:collapse">
    ${row('Name', full_name)}
    ${row('Email', email)}
    ${row('Organization', company)}
    ${row('Title', title)}
    ${row('Commitment', ticket)}
    ${row('Source', source)}
    ${row('Received', new Date().toISOString())}
  </table>
  ${message ? `<div style="margin-top:16px;padding:12px;background:#faf8f4;border:1px solid #e8e2d6;color:#333;font:14px/1.6 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${esc(message)}</div>` : ''}
  <div style="margin-top:18px;font:12px/1.5 -apple-system,Segoe UI,sans-serif;color:#888">Reply directly to this email to reach the applicant.</div>
</div>`;

    const raw = createRawEmail(NOTIFY_TO, subject, html, `${full_name} <${email}>`);

    const response = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GOOGLE_MAIL_API_KEY,
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gmail send failed [${response.status}]: ${errorBody}`);
      return new Response(
        JSON.stringify({ error: 'Email send failed', status: response.status, details: errorBody }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('notify-lp-application error:', e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
