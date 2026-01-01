import type { APIRoute } from 'astro';
import { getSupabaseClientForAPI } from '../../lib/supabase-api';

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  const body = await request.json();
  const userId = (locals as any).user?.id;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await getSupabaseClientForAPI(context);

  const { error } = await supabase
    .from('reader_settings')
    .upsert({
      user_id: userId,
      ...body,
    });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response('OK', { status: 200 });
};

export const GET: APIRoute = async (context) => {
  const { locals } = context;
  const userId = (locals as any).user?.id;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await getSupabaseClientForAPI(context);

  const { data, error } = await supabase
    .from('reader_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
