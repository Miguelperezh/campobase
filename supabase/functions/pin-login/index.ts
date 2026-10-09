import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import {pinFingerprint} from "../_shared/delegate-policy.mjs";

const APP_ORIGIN = "https://miguelperezh.github.io";
const corsHeaders = {
  "Access-Control-Allow-Origin": APP_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a = "", b = "") {
  if (a.length !== b.length || !a.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ message: "Método no permitido." }, 405);

  const origin = req.headers.get("Origin") || "";
  if (origin && origin !== APP_ORIGIN) return json({ message: "Origen no permitido." }, 403);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ message: "Servicio no disponible." }, 503);

  let body: { user_id?: string; pin?: string; identifier?: string; role?: string } = {};
  try { body = await req.json(); } catch {}
  let userId = String(body.user_id || "").trim();
  const pin = String(body.pin || "").trim();
  const identifier = String(body.identifier || "").trim().toLowerCase();
  const requestedRole = body.role === "delegate" ? "delegate" : body.role === "owner" ? "owner" : "auto";

  if (!/^\d{4,8}$/.test(pin)) {
    return json({ message: "Acceso no válido." }, 400);
  }

  if (userId && !/^[0-9a-f-]{36}$/i.test(userId)) {
    userId = "";
  }

  const rawIp = (req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown")
    .split(",")[0].trim();
  const ipHash = await sha256Hex(rawIp);
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  if (!userId && identifier) {
    const cleanId = identifier.replace(/^@/, "").trim();
    const { data: profile } = await admin
      .from("perfiles")
      .select("id")
      .or(`email.eq.${identifier},username.eq.${cleanId}`)
      .maybeSingle();
    if (profile?.id) userId = profile.id;
  }

  // A remembered delegate identity resolves only to its trusted owner; PIN is still verified below.
  if (userId) {
    const {data: remembered} = await admin.auth.admin.getUserById(userId);
    if (remembered?.user?.app_metadata?.campobase_role === "delegate_pin") {
      userId = String(remembered.user.app_metadata.campobase_owner_id || "");
    }
  }
  const now = Date.now();
  const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000).toISOString();
  const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();

  const [{ count: ipFailures, error: ipCountError }, { count: userFailures, error: userCountError }] = await Promise.all([
    admin
      .from("pin_login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("success", false)
      .gte("attempted_at", fifteenMinutesAgo),
    userId
      ? admin
          .from("pin_login_attempts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("success", false)
          .gte("attempted_at", oneHourAgo)
      : Promise.resolve({ count: 0, error: null }),
  ]);

  if (ipCountError || userCountError) return json({ message: "No se pudo comprobar el acceso." }, 503);
  if ((ipFailures || 0) >= 5 || (userFailures || 0) >= 20) {
    return json({ message: "Demasiados intentos. Espera unos minutos antes de volver a probar." }, 429);
  }

  let config: { payload?: { pinSalt?: string; ownerPinHash?: string; delegatePinHash?: string; delegatePin?: string } } | null = null;
  if (!userId) {
    const { data: configs, error: configsError } = await admin
      .from("configuracion")
      .select("user_id,payload")
      .eq("id", "main")
      .is("deleted_at", null);

    if (configsError || !configs?.length) {
      await admin.from("pin_login_attempts").insert({ user_id: "00000000-0000-0000-0000-000000000000", ip_hash: ipHash, success: false });
      return json({ message: "PIN incorrecto o cuenta no disponible." }, 401);
    }

    const matchedUsers: Array<{ user_id: string; payload: { pinSalt?: string; ownerPinHash?: string; delegatePinHash?: string; delegatePin?: string } }> = [];
    for (const item of configs) {
      if (item?.payload?.pinSalt && item?.payload?.ownerPinHash) {
        const cand = await sha256Hex(`${item.payload.pinSalt}:${pin}`);
        if ((requestedRole !== "delegate" && safeEqual(cand, String(item.payload.ownerPinHash || ""))) || (requestedRole !== "owner" && (item.payload.delegatePinHash ? safeEqual(cand, item.payload.delegatePinHash) : safeEqual(pin, String(item.payload.delegatePin || ""))))) {
          matchedUsers.push(item);
        }
      }
    }

    if (matchedUsers.length === 0) {
      await admin.from("pin_login_attempts").insert({ user_id: "00000000-0000-0000-0000-000000000000", ip_hash: ipHash, success: false });
      return json({ message: "PIN incorrecto." }, 401);
    }

    if (matchedUsers.length > 1) {
      return json({ message: "Hay varias cuentas con este PIN. Inicia sesión con tu correo o usuario en Ajustes." }, 409);
    }

    userId = matchedUsers[0].user_id;
    config = matchedUsers[0];
  } else {
    const { data: userConfig, error: configError } = await admin
      .from("configuracion")
      .select("payload")
      .eq("user_id", userId)
      .eq("id", "main")
      .is("deleted_at", null)
      .maybeSingle();
    config = userConfig;
  }

  if (!config?.payload?.pinSalt || !config?.payload?.ownerPinHash) {
    await admin.from("pin_login_attempts").insert({ user_id: userId, ip_hash: ipHash, success: false });
    return json({ message: "PIN incorrecto o cuenta no disponible." }, 401);
  }

  const candidate = await sha256Hex(`${config.payload.pinSalt}:${pin}`);
  const isOwner = requestedRole !== "delegate" && safeEqual(candidate, String(config.payload.ownerPinHash || ""));
  const isDelegate = requestedRole !== "owner" && (config.payload.delegatePinHash ? safeEqual(candidate, config.payload.delegatePinHash) : safeEqual(pin, String(config.payload.delegatePin || "")));
  const pinOk = isOwner || isDelegate;
  if (!pinOk) {
    await admin.from("pin_login_attempts").insert({ user_id: userId, ip_hash: ipHash, success: false });
    return json({ message: "PIN incorrecto." }, 401);
  }

  const { data: subscription, error: subscriptionError } = await admin
    .from("suscripciones")
    .select("estado,expira_en")
    .eq("user_id", userId)
    .maybeSingle();

  if (subscriptionError) return json({ message: "No se pudo comprobar el acceso de la cuenta." }, 503);
  const expiresAt = subscription?.expira_en ? new Date(subscription.expira_en).getTime() : 0;
  const notExpired = !expiresAt || expiresAt > now;
  const commercialAccess = Boolean(subscription) && notExpired
    && ["gift_free", "trial", "active"].includes(String(subscription.estado || ""));
  if (!commercialAccess) return json({ message: "Esta cuenta no tiene acceso activo." }, 403);

  const ownerId = userId;
  if (!isOwner && isDelegate) {
    const {data:team,error:teamError}=await admin.from("equipos_cuenta").select("id").eq("owner_user_id",ownerId).maybeSingle();
    if(teamError||!team)return json({message:"No se pudo vincular el delegado al equipo."},503);
    const {data:member,error:memberError}=await admin.from("equipo_miembros").select("user_id").eq("equipo_id",team.id).eq("role","delegate").maybeSingle();
    if(memberError)return json({message:"No se pudo comprobar la cuenta del delegado."},503);
    const version=await pinFingerprint(config.payload);
    let existingId = member?.user_id;
    if (!existingId) {
      const {data:profile} = await admin.from("perfiles").select("id").eq("email",`pin-delegate+${ownerId}@campobase.invalid`).maybeSingle();
      existingId = profile?.id;
    }
    if(existingId){
      const {data:existing}=await admin.auth.admin.getUserById(existingId);
      if(existing?.user?.app_metadata?.campobase_role!=="delegate_pin"||existing.user.app_metadata.campobase_owner_id!==ownerId)return json({message:"Este equipo ya tiene otro acceso de delegado asociado."},409);
      userId=existingId;
      const {error}=await admin.auth.admin.updateUserById(userId,{app_metadata:{...existing.user.app_metadata,campobase_pin_version:version}});
      if(error)return json({message:"No se pudo renovar la sesión del delegado."},503);
    }else{
      const {data:created,error}=await admin.auth.admin.createUser({
        email:`pin-delegate+${ownerId}@campobase.invalid`,email_confirm:true,password:crypto.randomUUID()+crypto.randomUUID(),
        app_metadata:{campobase_role:"delegate_pin",campobase_owner_id:ownerId,campobase_pin_version:version},
        user_metadata:{full_name:"Delegado",club_name:"",account_role:"delegate"}
      });
      if(error||!created?.user)return json({message:"No se pudo preparar el acceso del delegado. Vuelve a intentar entrar."},503);
      userId=created.user.id;
    }
    // Auth inserts base rows before setting app_metadata. Provision only the trusted
    // technical identity after createUser returns; all existing team data stays put.
    const {data:provisioned,error:provisionError}=await admin.rpc("provision_delegate_pin",{p_user:userId,p_owner:ownerId});
    if(provisionError||!provisioned)return json({message:"No se pudo vincular la sesión del delegado."},503);
  }

  const { data: userData, error: userError } = await admin.auth.admin.getUserById(userId);
  const email = userData?.user?.email || "";
  if (userError || !email) return json({ message: "No se pudo crear la sesión." }, 503);

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://miguelperezh.github.io/campobase/" },
  });
  const tokenHash = linkData?.properties?.hashed_token || "";
  if (linkError || !tokenHash) return json({ message: "No se pudo crear la sesión segura." }, 503);

  await admin.from("pin_login_attempts").insert({ user_id: userId, ip_hash: ipHash, success: true });
  await admin
    .from("pin_login_attempts")
    .delete()
    .eq("user_id", userId)
    .eq("ip_hash", ipHash)
    .eq("success", false)
    .lt("attempted_at", new Date(now - 60 * 1000).toISOString());

  return json({ token_hash: tokenHash, type: "email", user_id: userId, owner_user_id: ownerId, role: isOwner ? "owner" : "delegate" });
});
