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
	await db
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
}

export async function getAllReadingProgress(userId: string) {
	const progress = await db.query.readingProgress.findMany({
		where: eq(readingProgress.userId, userId),
		orderBy: [desc(readingProgress.lastReadAt)],
	});
	return progress;
}
