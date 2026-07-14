// ════════════════════════════════════════════════════════════════
// Admission data layer (client-side, browser Supabase client).
// Auth model: national-id + date-of-birth → synthesized Supabase Auth
// credentials. RLS guarantees each applicant only touches their own row.
// All functions no-op-safe: callers should gate on `supabaseEnabled`.
// ════════════════════════════════════════════════════════════════
import { createClient } from '../supabase/client';

// Part of every applicant's login email — DO NOT change after launch.
const EMAIL_DOMAIN = 'applicant.eec.local';

export const supabaseEnabled =
  !!import.meta.env.PUBLIC_SUPABASE_URL && !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// ── credential derivation ───────────────────────────────────────
const digits = (s: string) => (s || '').replace(/\D/g, '');

/** Buddhist-era {d,m,y} (y like "2552") → ISO CE date "2009-06-15". */
export function dobToISO(d: string, m: string, y: string): string {
  const ce = Number(y) - 543;
  const pad = (n: string) => n.padStart(2, '0');
  return `${ce}-${pad(m)}-${pad(d)}`;
}

function creds(nationalId: string, dobISO: string) {
  const id = digits(nationalId);
  return {
    email: `${id}@${EMAIL_DOMAIN}`,
    // reproducible from (national id + dob); ≥6 chars; unique per applicant.
    password: `${id}.${dobISO.replace(/-/g, '')}`,
  };
}

export function genAppNo(): string {
  // EEC69-XXXXXX (year 2569 cohort). Random 6 digits — collisions handled by
  // the unique constraint (retry on the rare clash).
  const n = Math.floor(100000 + Math.random() * 900000);
  return `EEC69-${n}`;
}

export type AuthResult = { ok: boolean; userId?: string; error?: string };

/**
 * Sign in with national-id + dob; if no account exists, create one and seed
 * an application stub. Returns a friendly Thai error otherwise.
 */
export async function signInOrUp(nationalId: string, dobISO: string): Promise<AuthResult> {
  const sb = createClient();
  const { email, password } = creds(nationalId, dobISO);

  const signIn = await sb.auth.signInWithPassword({ email, password });
  if (!signIn.error && signIn.data.user) {
    return { ok: true, userId: signIn.data.user.id };
  }

  // Either no account yet, or wrong dob. Try to register.
  const signUp = await sb.auth.signUp({ email, password });
  if (signUp.error) {
    if (/already registered|already exists/i.test(signUp.error.message)) {
      return { ok: false, error: 'วันเดือนปีเกิดไม่ตรงกับเลขบัตรประชาชนนี้' };
    }
    return { ok: false, error: signUp.error.message };
  }
  const user = signUp.data.user;
  if (!user) {
    return { ok: false, error: 'สร้างบัญชีไม่สำเร็จ — ตรวจสอบการตั้งค่า Confirm email ใน Supabase' };
  }

  // Seed the application row (idempotent on user_id).
  await sb.from('applications').upsert(
    { user_id: user.id, app_no: genAppNo(), national_id: digits(nationalId), dob: dobISO },
    { onConflict: 'user_id', ignoreDuplicates: true },
  );
  return { ok: true, userId: user.id };
}

export async function currentUserId(): Promise<string | null> {
  const sb = createClient();
  const { data } = await sb.auth.getUser();
  return data.user?.id ?? null;
}

export async function signOut(): Promise<void> {
  await createClient().auth.signOut();
}

// ── application row I/O ──────────────────────────────────────────
export type AppRow = {
  user_id: string;
  app_no: string;
  national_id: string;
  dob: string | null;
  status: string;
  paid: boolean;
  submitted_at: string | null;
  form_data: Record<string, unknown>;
};

export async function fetchApplication(): Promise<AppRow | null> {
  const sb = createClient();
  const { data } = await sb.from('applications').select('*').maybeSingle();
  return (data as AppRow) ?? null;
}

/** Upsert the caller's own application. `form` is stored whole in form_data;
 *  a few key columns are mirrored for admin querying. */
export async function saveApplication(
  form: Record<string, unknown>,
  opts?: { submit?: boolean; paid?: boolean },
): Promise<{ ok: boolean; error?: string }> {
  const sb = createClient();
  const uid = await currentUserId();
  if (!uid) return { ok: false, error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' };

  const patch: Record<string, unknown> = {
    user_id: uid,
    form_data: form,
    first_name: form.firstName ?? null,
    last_name: form.lastName ?? null,
    phone: form.phone ?? null,
    email: form.email ?? null,
    level: form.level ?? null,
    round: form.round ?? null,
    major: form.major ?? null,
  };
  if (opts?.paid !== undefined) patch.paid = opts.paid;
  if (opts?.submit) {
    patch.status = 'submitted';
    patch.submitted_at = new Date().toISOString();
  }

  const { error } = await sb.from('applications').update(patch).eq('user_id', uid);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── status timeline ──────────────────────────────────────────────
export type StatusEvent = { status: string; created_at: string };

export async function fetchStatus(): Promise<{ status: string; events: StatusEvent[] } | null> {
  const sb = createClient();
  const app = await fetchApplication();
  if (!app) return null;
  const { data } = await sb
    .from('application_status_events')
    .select('status, created_at')
    .order('created_at', { ascending: true });
  return { status: app.status, events: (data as StatusEvent[]) ?? [] };
}

// ── document upload (Storage) ─────────────────────────────────────
export async function uploadDoc(
  docType: string,
  file: File,
): Promise<{ ok: boolean; path?: string; error?: string }> {
  const sb = createClient();
  const uid = await currentUserId();
  if (!uid) return { ok: false, error: 'เซสชันหมดอายุ' };

  const path = `${uid}/${docType}/${file.name}`;
  const up = await sb.storage.from('application-docs').upload(path, file, { upsert: true });
  if (up.error) return { ok: false, error: up.error.message };

  await sb.from('application_documents').upsert(
    { user_id: uid, doc_type: docType, file_path: path, file_name: file.name },
    { onConflict: 'user_id,doc_type' },
  );
  return { ok: true, path };
}
