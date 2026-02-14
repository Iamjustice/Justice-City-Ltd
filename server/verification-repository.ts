import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const TABLE = process.env.SUPABASE_VERIFICATIONS_TABLE || "verifications";

type VerificationRecord = {
  user_id: string;
  mode: "kyc" | "biometric";
  provider: "smile-id" | "mock";
  status: "approved" | "pending" | "failed";
  job_id: string;
  smile_job_id?: string | null;
  message?: string | null;
};

function getClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function saveVerification(record: VerificationRecord): Promise<void> {
  const client = getClient();
  if (!client) return;

  const { error } = await client.from(TABLE).insert(record);
  if (error) {
    throw new Error(`Supabase saveVerification failed: ${error.message}`);
  }
}

export async function updateVerificationByJobId(
  jobId: string,
  status: "approved" | "pending" | "failed",
  message?: string,
): Promise<void> {
  const client = getClient();
  if (!client) return;

  const { error } = await client
    .from(TABLE)
    .update({ status, message: message ?? null })
    .eq("job_id", jobId);

  if (error) {
    throw new Error(`Supabase updateVerificationByJobId failed: ${error.message}`);
  }
}
