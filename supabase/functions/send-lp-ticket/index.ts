import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_mail/gmail/v1';
const BCC = 'info@decahedronventures.com';
const DATAROOM_URL = 'https://decahedronventures.com/dataroom';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const encodeHeader = (value: string) =>
  /^[\x20-\x7E]*$/.test(value)
    ? value
    : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(value)))}?=`;

function createRawEmail(to: string, subject: string, html: string) {
  const lines = [
    `To: ${to}`,
    `Bcc: ${BCC}`,
    `Subject: ${encodeHeader(subject)}`,
    'X-Decahedron-Notification: lp-ticket',
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

function makeTicketCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const body = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
  return `DCH-LP-${body.slice(0, 4)}-${body.slice(4, 8)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GOOGLE_MAIL_API_KEY = Deno.env.get('GOOGLE_MAIL_API_KEY');
    if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
      throw new Error('LOVABLE_API_KEY and GOOGLE_MAIL_API_KEY must be configured');
    }

    const json = (b: unknown, status = 200) =>
      new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // ── Admin-only ──────────────────────────────────────────
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return json({ error: 'Unauthorized' }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: 'Unauthorized' }, 401);

    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });
    if (!isAdmin) return json({ error: 'Forbidden' }, 403);

    // ── Input ───────────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const applicationId = String(body.application_id ?? '').trim();
    if (!/^[0-9a-f-]{36}$/i.test(applicationId)) return json({ error: 'Valid application_id is required' }, 400);
    const resend = body.resend === true;

    const { data: app, error: appErr } = await admin
      .from('limited_partner_applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle();
    if (appErr) throw appErr;
    if (!app) return json({ error: 'Application not found' }, 404);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(app.email ?? '')) return json({ error: 'Application has no valid email' }, 400);
    if (app.ticket_sent_at && !resend) {
      return json({ ok: true, already_sent: true, ticket_code: app.ticket_code });
    }

    const ticketCode: string = app.ticket_code || makeTicketCode();
    const issued = new Date();

    const subject = `[LP TICKET] ${app.full_name} — Decahedron Fund I Admission — ${ticketCode}`;

    const line = (k: string, v: string) =>
      v
        ? `<tr><td style="padding:6px 14px 6px 0;color:#8a8a8a;font:12px/1.4 monospace;letter-spacing:.08em;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#111;font:14px/1.5 -apple-system,Segoe UI,sans-serif">${esc(v)}</td></tr>`
        : '';

    const html = `<div style="max-width:640px;font-family:-apple-system,Segoe UI,sans-serif">
  <div style="border-left:4px solid #c98a2b;padding:6px 0 6px 12px;margin-bottom:18px">
    <div style="font:11px/1.4 monospace;letter-spacing:.25em;color:#c98a2b">DECAHEDRON VENTURES</div>
    <div style="font:22px/1.3 Georgia,serif;color:#111;margin-top:4px">Your Entry Ticket — Decahedron Fund I</div>
  </div>

  <p style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#333">
    ${esc(app.full_name)}, your limited partner application has been <strong>approved</strong>.
    Below is your admission ticket for onboarding and data room access.
  </p>

  <div style="margin:20px 0;border:1px dashed #c98a2b;background:#faf8f4;padding:18px;text-align:center">
    <div style="font:11px/1.4 monospace;letter-spacing:.3em;color:#8a7a58">ENTRY TICKET</div>
    <div style="font:26px/1.3 monospace;letter-spacing:.14em;color:#111;margin-top:8px">${esc(ticketCode)}</div>
    <div style="font:12px/1.5 -apple-system,Segoe UI,sans-serif;color:#8a8a8a;margin-top:8px">Issued ${issued.toUTCString()}</div>
  </div>

  <table style="border-collapse:collapse">
    ${line('HOLDER', app.full_name ?? '')}
    ${line('EMAIL', app.email ?? '')}
    ${line('ORGANIZATION', app.company_name ?? '')}
    ${line('COMMITMENT', app.investment_amount ?? '')}
    ${line('STATUS', 'Approved')}
  </table>

  <p style="font:14px/1.6 -apple-system,Segoe UI,sans-serif;color:#333;margin-top:20px">
    Present this ticket code when requesting data room access:
    <a href="${DATAROOM_URL}" style="color:#c98a2b">${DATAROOM_URL}</a>
  </p>

  <p style="font:12px/1.6 -apple-system,Segoe UI,sans-serif;color:#888;margin-top:18px">
    This ticket is personal, non-transferable, and does not constitute an offer to sell securities.
    Interests are offered only to accredited investors under Rule 506(b).
  </p>
</div>`;

    const raw = createRawEmail(`${app.full_name} <${app.email}>`, subject, html);

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
      const details = await response.text();
      console.error(`Gmail send failed [${response.status}]: ${details}`);
      return json({ error: 'Email send failed', status: response.status, details }, response.status);
    }

    const { error: updErr } = await admin
      .from('limited_partner_applications')
      .update({ ticket_code: ticketCode, ticket_sent_at: issued.toISOString(), status: 'approved' })
      .eq('id', applicationId);
    if (updErr) console.error('Ticket persist failed:', updErr);

    return json({ ok: true, ticket_code: ticketCode, sent_at: issued.toISOString() });
  } catch (e) {
    console.error('send-lp-ticket error:', e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
