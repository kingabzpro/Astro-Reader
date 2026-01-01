import type { APIRoute } from 'astro';
import { getSupabaseClientForAPI } from '../../../lib/supabase-api';

export const POST: APIRoute = async (context) => {
  const { request } = context;
  const { email, password } = await request.json();

  const supabase = await getSupabaseClientForAPI(context);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Initialize default settings if they don't exist
  if (data.user) {
    await supabase.from('reader_settings').upsert({
      user_id: data.user.id,
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
