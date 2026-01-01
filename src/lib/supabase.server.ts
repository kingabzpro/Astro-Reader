import { createServerClient } from '@supabase/ssr';
import type { APIContext } from 'astro';

export async function getSupabaseClient(context: APIContext) {
  const cookies = context.cookies as unknown as {
    getAll: () => { name: string; value: string }[];
    set: (name: string, value: string, options: any) => void;
  };

  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, options)
          );
        },
      },
    }
  );
}
