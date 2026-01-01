import { auth } from '../../../lib/auth';
import type { APIRoute } from 'astro';

export const ALL: APIRoute = async ({ request }) => {
	try {
		return await auth.handler(request);
	} catch (error) {
		console.error('Auth API error:', error);
		return new Response(JSON.stringify({ error: 'Authentication failed' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

// Support both GET and POST
export const GET = ALL;
export const POST = ALL;
export const PUT = ALL;
export const PATCH = ALL;
export const DELETE = ALL;
