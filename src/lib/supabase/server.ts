import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  const isLocal =
    process.env.NODE_ENV === "development" ||
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("localhost"));
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // On localhost (http) Secure cookies are dropped -> OAuth state mismatch.
        secure: !isLocal,
        sameSite: "lax",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component — safe to ignore, middleware refreshes session
          }
        },
      },
    }
  );
}
