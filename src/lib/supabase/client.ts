import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // localhost is http (not https) so Secure cookies are dropped by the
        // browser, which breaks OAuth PKCE `state` matching -> bad_oauth_state.
        secure: false,
        sameSite: "lax",
      },
    }
  );
}
