import { defineMiddleware } from 'astro:middleware';
import { auth } from './auth';

export const onRequest = defineMiddleware(async (context, next) => {
	// Public routes that don't require authentication
	// Only the landing page, login, register, logout, and auth API are public
	// Everything else (including /books/*) requires authentication
	const publicRoutes = ['/login', '/register', '/logout', '/api/auth'];
	const isPublicRoute =
		publicRoutes.some((route) => context.url.pathname.startsWith(route)) ||
		context.url.pathname === '/'; // Make landing page public

	if (isPublicRoute) {
		return next();
	}

	// Get session using Better Auth
	const session = await auth.api.getSession({
		headers: context.request.headers,
	});

	// Redirect to login if not authenticated
	if (!session) {
		return context.redirect('/login');
	}

	// Attach user info to locals
	context.locals.user = {
		...session.user,
		image: session.user.image ?? null,
	};
	context.locals.session = {
		...session.session,
		ipAddress: session.session.ipAddress ?? null,
		userAgent: session.session.userAgent ?? null,
	};

	return next();
});
