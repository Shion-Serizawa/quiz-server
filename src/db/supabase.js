import { createClient } from "@supabase/supabase-js";

// see: https://supabase.com/docs/reference/javascript/initializing

export function getSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(supabaseUrl, supabaseKey);
}
