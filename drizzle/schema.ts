import { pgTable, text, timestamp, uuid, doublePrecision, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Better Auth user table
export const user = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	name: text('name'),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Better Auth account table - stores credentials for email/password and OAuth providers
export const account = pgTable('account', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Better Auth session table
export const session = pgTable('session', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
});

// Reader settings table
export const readerSettings = pgTable('reader_settings', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
	theme: text('theme').notNull().default('system'),
	fontSize: text('font_size').notNull().default('18'),
	lineHeight: text('line_height').notNull().default('1.6'),
	contentWidth: text('content_width').notNull().default('720'),
	fontFamily: text('font_family').notNull().default('sans-serif'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reading progress table
export const readingProgress = pgTable('reading_progress', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	bookId: text('book_id').notNull(),
	chapterId: text('chapter_id').notNull(),
	scrollPosition: doublePrecision('scroll_position').notNull().default(0),
	lastReadAt: timestamp('last_read_at').defaultNow().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	userBookChapterIdx: uniqueIndex('user_book_chapter_idx').on(table.userId, table.bookId, table.chapterId),
}));

// Relations
export const userRelations = relations(user, ({ many }) => ({
	accounts: many(account),
	sessions: many(session),
	readerSettings: many(readerSettings),
	readingProgress: many(readingProgress),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const readerSettingsRelations = relations(readerSettings, ({ one }) => ({
	user: one(user, {
		fields: [readerSettings.userId],
		references: [user.id],
	}),
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
	user: one(user, {
		fields: [readingProgress.userId],
		references: [user.id],
	}),
}));
