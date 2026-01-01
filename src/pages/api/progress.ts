import type { APIRoute } from 'astro';
import { getSupabaseClientForAPI } from '../../lib/supabase-api';

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  const { bookId, chapterId, progress } = await request.json();

  const userId = (locals as any).user?.id;

  if (!userId || !bookId || !chapterId) {
    return new Response('Bad request', { status: 400 });
  }

  const supabase = await getSupabaseClientForAPI(context);

  const { error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: userId,
      book_id: bookId,
      chapter_id: chapterId,
      scroll_position: progress,
      last_read_at: new Date().toISOString(),
    });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response('OK', { status: 200 });
};

export const GET: APIRoute = async (context) => {
  const { url, locals } = context;
  const bookId = url.searchParams.get('book');
  const chapterId = url.searchParams.get('chapter');

  const userId = (locals as any).user?.id;

  if (!userId || !bookId || !chapterId) {
    return new Response('Bad request', { status: 400 });
  }

  const supabase = await getSupabaseClientForAPI(context);

  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .eq('chapter_id', chapterId)
    .single();

  if (error) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
