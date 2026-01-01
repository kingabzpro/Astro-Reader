import { createServerClient } from '@supabase/ssr';
import type { APIContext } from 'astro';

export async function getSupabaseClientForAPI(context: APIContext) {
  const cookieHeader = context.request.headers.get('Cookie') ?? '';

  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          const cookies: { name: string; value: string }[] = [];
          cookieHeader.split(';').forEach(cookie => {
            const [name, ...rest] = cookie.split('=');
            if (name && rest.length > 0) {
              cookies.push({
                name: name.trim(),
                value: decodeURIComponent(rest.join('=')),
              });
            }
          });
          return cookies;
        },
        setAll(cookiesToSet) {
          context.cookies.set(cookiesToSet[0].name, cookiesToSet[0].value, cookiesToSet[0].options);
        },
      },
    }
  );
}
