import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    // Attach cookies to the response (next/headers cookies are read-only in route handlers,
    // so we must write them onto the NextResponse itself — same pattern as middleware).
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: { secure: false, sameSite: "lax" },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc("provision_user_on_login");
      }
      return response;
    }

    // "state already used" can happen if the callback URL is hit twice (e.g. browser
    // prefetch / reload of a stale URL). If a session already exists, just proceed.
    const {
      data: { user: existing },
    } = await supabase.auth.getUser();
    if (existing) return response;
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
