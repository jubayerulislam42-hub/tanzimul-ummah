import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // `next` may arrive as a query param OR a cookie (we set the cookie in AuthButton so the
  // redirectTo stays a clean path that matches Supabase's uri_allow_list).
  let next = searchParams.get("next") ?? "";
  if (!next) {
    const cookieNext = request.cookies.get("next_url")?.value;
    if (cookieNext) next = decodeURIComponent(cookieNext);
  }
  next = next || "/dashboard";

  if (code) {
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
      // Clear the next_url cookie after use.
      response.cookies.set("next_url", "", { maxAge: 0, path: "/" });
      return response;
    }

    // "state already used" / expired can happen if the callback URL is hit twice.
    // If a session already exists, just proceed to next.
    const {
      data: { user: existing },
    } = await supabase.auth.getUser();
    if (existing) return response;
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
