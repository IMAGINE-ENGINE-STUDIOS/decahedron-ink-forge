// Server-side gatekeeper for the investor data room.
// Verifies access (admin password, approved LP email, LP password, or share token)
// and performs all reads/writes with the service role. Files are served via
// short-lived signed URLs from the private "data-room" bucket.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const ADMIN_PASSWORD = Deno.env.get("DATA_ROOM_ADMIN_PASSWORD") ?? "VenturePartners";
const LP_PASSWORD = Deno.env.get("DATA_ROOM_LP_PASSWORD") ?? "VentureFund";
const ADMIN_ONLY_CATEGORIES = new Set(["articles"]);

const Creds = z.object({
  adminPassword: z.string().max(200).optional(),
  lpPassword: z.string().max(200).optional(),
  lpEmail: z.string().email().max(255).optional(),
  shareToken: z.string().max(100).optional(),
});

const Body = z.object({
  action: z.enum([
    "check_email", "verify", "list", "signed_url",
    "upload_url", "register", "delete", "move",
    "list_shares", "create_share", "delete_share",
  ]),
  creds: Creds.default({}),
  payload: z.record(z.unknown()).default({}),
});

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

type Share = { scope: string; category: string | null; subfolder: string | null; expires_at: string | null };
type Access = { role: "admin" } | { role: "lp" } | { role: "share"; share: Share } | null;

async function resolve(c: z.infer<typeof Creds>): Promise<Access> {
  if (c.adminPassword && c.adminPassword === ADMIN_PASSWORD) return { role: "admin" };
  if (c.lpPassword && c.lpPassword === LP_PASSWORD) return { role: "lp" };
  if (c.lpEmail) {
    const { data } = await sb.from("limited_partner_applications").select("status")
      .eq("email", c.lpEmail.trim().toLowerCase()).order("created_at", { ascending: false }).limit(1);
    if (data?.[0]?.status === "approved") return { role: "lp" };
  }
  if (c.shareToken) {
    const { data } = await sb.from("data_room_share_links")
      .select("scope,category,subfolder,expires_at").eq("token", c.shareToken).maybeSingle();
    if (data && (!data.expires_at || new Date(data.expires_at) > new Date())) return { role: "share", share: data };
  }
  return null;
}

function visible(doc: { category: string; subfolder: string | null }, a: NonNullable<Access>) {
  if (a.role === "admin") return true;
  if (ADMIN_ONLY_CATEGORIES.has(doc.category)) return false;
  if (a.role === "share") {
    const s = a.share;
    if (s.scope === "category") return doc.category === s.category;
    if (s.scope === "subfolder") return doc.category === s.category && doc.subfolder === s.subfolder;
  }
  return true;
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.slice(0, max) : null);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Invalid request" }, 400);
  const { action, creds, payload } = parsed.data;

  try {
    if (action === "check_email") {
      const email = z.string().email().max(255).safeParse(payload.email);
      if (!email.success) return json({ error: "Invalid email" }, 400);
      const { data } = await sb.from("limited_partner_applications").select("status")
        .eq("email", email.data.trim().toLowerCase()).order("created_at", { ascending: false }).limit(1);
      return json({ status: data?.[0]?.status ?? null });
    }

    const access = await resolve(creds);
    if (!access) return json({ error: "Access denied" }, 403);

    if (action === "verify") {
      return json({ role: access.role, share: access.role === "share" ? access.share : null });
    }

    if (action === "list") {
      const { data, error } = await sb.from("data_room_documents")
        .select("id,name,category,subfolder,file_path,file_size,mime_type,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json({ documents: (data ?? []).filter((d) => visible(d, access)) });
    }

    if (action === "signed_url") {
      const id = z.string().uuid().safeParse(payload.id);
      if (!id.success) return json({ error: "Invalid id" }, 400);
      const { data: doc } = await sb.from("data_room_documents").select("category,subfolder,file_path").eq("id", id.data).maybeSingle();
      if (!doc || !visible(doc, access)) return json({ error: "Not found" }, 404);
      const { data, error } = await sb.storage.from("data-room").createSignedUrl(doc.file_path, 600);
      if (error) throw error;
      return json({ url: data.signedUrl });
    }

    // ---- Admin-only actions below ----
    if (access.role !== "admin") return json({ error: "Admin only" }, 403);

    if (action === "upload_url") {
      const path = str(payload.path, 500);
      if (!path || path.includes("..")) return json({ error: "Invalid path" }, 400);
      const { data, error } = await sb.storage.from("data-room").createSignedUploadUrl(path);
      if (error) throw error;
      return json({ path: data.path, token: data.token });
    }
    if (action === "register") {
      const row = {
        name: str(payload.name, 300), category: str(payload.category, 100),
        subfolder: str(payload.subfolder, 200), file_path: str(payload.file_path, 500),
        file_size: typeof payload.file_size === "number" ? payload.file_size : null,
        mime_type: str(payload.mime_type, 200),
      };
      if (!row.name || !row.category || !row.file_path) return json({ error: "Invalid document" }, 400);
      const { error } = await sb.from("data_room_documents").insert(row);
      if (error) throw error;
      return json({ ok: true });
    }
    if (action === "delete") {
      const id = z.string().uuid().parse(payload.id);
      const { data: doc } = await sb.from("data_room_documents").select("file_path").eq("id", id).maybeSingle();
      if (doc) await sb.storage.from("data-room").remove([doc.file_path]);
      const { error } = await sb.from("data_room_documents").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }
    if (action === "move") {
      const id = z.string().uuid().parse(payload.id);
      const { error } = await sb.from("data_room_documents")
        .update({ category: str(payload.category, 100), subfolder: str(payload.subfolder, 200) }).eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }
    if (action === "list_shares") {
      const { data, error } = await sb.from("data_room_share_links").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return json({ links: data ?? [] });
    }
    if (action === "create_share") {
      const scope = z.enum(["all", "category", "subfolder"]).parse(payload.scope);
      const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 10);
      const { data, error } = await sb.from("data_room_share_links").insert({
        token, scope, label: str(payload.label, 200),
        category: str(payload.category, 100), subfolder: str(payload.subfolder, 200),
      }).select().single();
      if (error) throw error;
      return json({ link: data });
    }
    if (action === "delete_share") {
      const id = z.string().uuid().parse(payload.id);
      await sb.from("data_room_share_links").delete().eq("id", id);
      return json({ ok: true });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("data-room error", e);
    return json({ error: "Request failed" }, 500);
  }
});
