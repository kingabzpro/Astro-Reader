import type { APIRoute } from 'astro';
import { getSupabaseClientForAPI } from '../../../lib/supabase-api';

export const POST: APIRoute = async (context) => {
  const { request } = context;
  const { email, password } = await request.json();

  const supabase = await getSupabaseClientForAPI(context);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
