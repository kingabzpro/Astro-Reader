import { db, readerSettings, readingProgress } from './db';
import { eq, and, desc } from 'drizzle-orm';

// Reader Settings
export async function getUserSettings(userId: string) {
	const settings = await db.query.readerSettings.findFirst({
		where: eq(readerSettings.userId, userId),
	});
	return settings;
}

export async function upsertUserSettings(
	userId: string,
	data: {
		theme?: string;
		fontSize?: string;
		lineHeight?: string;
		contentWidth?: string;
		fontFamily?: string;
	}
) {
	await db
		.insert(readerSettings)
		.values({
			userId,
			...data,
		})
		.onConflictDoUpdate({
			target: readerSettings.userId,
			set: {
				...data,
				updatedAt: new Date(),
			},
		});
}

// Reading Progress
export async function getReadingProgress(userId: string, bookId: string, chapterId: string) {
	const progress = await db.query.readingProgress.findFirst({
		where: and(
			eq(readingProgress.userId, userId),
			eq(readingProgress.bookId, bookId),
			eq(readingProgress.chapterId, chapterId)
		),
	});
	return progress;
}

export async function upsertReadingProgress(
	userId: string,
	data: {
		bookId: string;
		chapterId: string;
		scrollPosition: number;
	}
) {
	console.log('[DB] upsertReadingProgress called:', { userId, data });
	try {
		const result = await db
			.insert(readingProgress)
			.values({
				userId,
				...data,
				lastReadAt: new Date(),
			})
			.onConflictDoUpdate({
				target: [
					readingProgress.userId,
					readingProgress.bookId,
					readingProgress.chapterId,
				],
				set: {
					scrollPosition: data.scrollPosition,
					lastReadAt: new Date(),
					updatedAt: new Date(),
				},
			});
		console.log('[DB] upsertReadingProgress success:', result);
		return result;
	} catch (error) {
		console.error('[DB] upsertReadingProgress error:', error);
		throw error;
	}
}

export async function getAllReadingProgress(userId: string) {
	console.log('[DB] getAllReadingProgress called for userId:', userId);
	try {
		const progress = await db.query.readingProgress.findMany({
			where: eq(readingProgress.userId, userId),
			orderBy: [desc(readingProgress.lastReadAt)],
		});
		console.log('[DB] getAllReadingProgress result:', progress.length, 'items');
		return progress;
	} catch (error) {
		console.error('[DB] getAllReadingProgress error:', error);
		throw error;
	}
}
