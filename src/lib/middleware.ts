import { defineMiddleware } from 'astro:middleware';
import { getSupabaseClient } from './supabase.server';

export const onRequest = defineMiddleware(async (context, next) => {
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/logout', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route =>
    context.url.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return next();
  }

  // Create Supabase client
  const supabase = await getSupabaseClient(context);

  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  if (!session) {
    return context.redirect('/login');
  }

  // Attach user info to locals
  context.locals.user = session.user;
  context.locals.session = session;

  return next();
});
