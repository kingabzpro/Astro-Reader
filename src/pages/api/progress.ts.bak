import type { APIRoute } from 'astro';
import { getReadingProgress, upsertReadingProgress } from '../../lib/database';

export const POST: APIRoute = async (context) => {
	const { request, locals } = context;
	const { bookId, chapterId, progress } = await request.json();

	const userId = locals.user?.id;

	if (!userId || !bookId || !chapterId) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await upsertReadingProgress(userId, {
			bookId,
			chapterId,
			scrollPosition: progress,
		});
		return new Response('OK', { status: 200 });
	} catch (error) {
		return new Response((error as Error).message, { status: 500 });
	}
};

export const GET: APIRoute = async (context) => {
	const { url, locals } = context;
	const bookId = url.searchParams.get('book');
	const chapterId = url.searchParams.get('chapter');

	const userId = locals.user?.id;

	if (!userId || !bookId || !chapterId) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		const progress = await getReadingProgress(userId, bookId, chapterId);

		if (!progress) {
			return new Response('Not found', { status: 404 });
		}

		return new Response(JSON.stringify(progress), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response((error as Error).message, { status: 500 });
	}
};
