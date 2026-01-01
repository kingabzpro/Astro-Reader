import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
	// Public routes that don't require authentication
	// Only the landing page, login, register, logout, and auth API are public
	// Everything else (including /books/* and /dashboard) requires authentication
	const publicRoutes = ['/login', '/register', '/logout', '/api/auth', '/api/settings', '/api/progress'];
	const isPublicRoute =
		publicRoutes.some((route) => context.url.pathname.startsWith(route)) ||
		context.url.pathname === '/'; // Make landing page public

	if (isPublicRoute) {
		// For public routes, still check session to populate locals for UI
		const session = await auth.api.getSession({
			headers: context.request.headers,
		});

		if (session) {
			context.locals.user = {
				...session.user,
				image: session.user.image ?? null,
			};
			context.locals.session = {
				...session.session,
				ipAddress: session.session.ipAddress ?? null,
				userAgent: session.session.userAgent ?? null,
			};
		}

		return next();
	}

	// Protected routes - get session
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
