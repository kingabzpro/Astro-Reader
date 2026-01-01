import { db, readerSettings, readingProgress } from './db';
import { eq, and } from 'drizzle-orm';

export async function getUserSettings(userId: string) {
	return await db.query.readerSettings.findFirst({
		where: eq(readerSettings.userId, userId),
	});
}

export async function saveUserSettings(
	userId: string,
	settings: {
		theme?: string;
		fontSize?: string;
		lineHeight?: string;
		contentWidth?: string;
		fontFamily?: string;
	}
) {
	await db.insert(readerSettings).values({
		userId,
		...settings,
	}).onConflictDoUpdate({
		target: readerSettings.userId,
		set: {
			...settings,
			updatedAt: new Date(),
		},
	});
}

export async function getReadingProgress(userId: string, bookId: string, chapterId: string) {
	return await db.query.readingProgress.findFirst({
		where: and(
			eq(readingProgress.userId, userId),
			eq(readingProgress.bookId, bookId),
			eq(readingProgress.chapterId, chapterId)
		),
	});
}

export async function saveProgress(userId: string, bookId: string, chapterId: string) {
	console.log('[DB] saveProgress called:', { userId, bookId, chapterId });
	
	const existing = await db.query.readingProgress.findFirst({
		where: and(
			eq(readingProgress.userId, userId),
			eq(readingProgress.bookId, bookId),
			eq(readingProgress.chapterId, chapterId)
		),
	});
	
	console.log('[DB] Existing record:', existing);
	
	if (existing) {
		console.log('[DB] Updating existing record');
		await db.update(readingProgress)
			.set({
				lastReadAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(readingProgress.id, existing.id));
	} else {
		console.log('[DB] Inserting new record');
		await db.insert(readingProgress).values({
			userId,
			bookId,
			chapterId,
			scrollPosition: 0,
			lastReadAt: new Date(),
		});
	}
	
	const afterSave = await db.query.readingProgress.findFirst({
		where: and(
			eq(readingProgress.userId, userId),
			eq(readingProgress.bookId, bookId),
			eq(readingProgress.chapterId, chapterId)
		),
	});
	console.log('[DB] Record after save:', afterSave);
}

export async function getAllProgress(userId: string) {
	const result = await db.query.readingProgress.findMany({
		where: eq(readingProgress.userId, userId),
	});
	console.log('[DB] getAllProgress result:', result.length, 'records');
	return result;
}
