import type { APIRoute } from 'astro';
import { upsertUserSettings, getUserSettings } from '../../lib/database';

export const POST: APIRoute = async (context) => {
	const { request, locals } = context;
	const body = await request.json();
	const userId = locals.user?.id;

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		await upsertUserSettings(userId, body);
		return new Response('OK', { status: 200 });
	} catch (error) {
		return new Response((error as Error).message, { status: 500 });
	}
};

export const GET: APIRoute = async (context) => {
	const { locals } = context;
	const userId = locals.user?.id;

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const settings = await getUserSettings(userId);
		return new Response(JSON.stringify(settings), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response((error as Error).message, { status: 500 });
	}
};
