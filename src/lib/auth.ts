import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv";
import * as schema from "../../drizzle/schema";
import { randomUUID } from "crypto";

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
		},
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 6,
		maxPasswordLength: 128,
		autoSignIn: true,
		sendResetPassword: async () => {
			console.log('Password reset requested');
		},
		sendVerificationEmail: async () => {
			console.log('Verification email sent');
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 24 hours
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
		freshAge: 60 * 5, // 5 minutes
	},
	advanced: {
		useSecureCookies: process.env.NODE_ENV === 'production',
		crossSubDomainCookies: {
			enabled: false,
		},
		cookiePrefix: 'reader',
		database: {
			generateId: () => randomUUID(),
		},
	},
	account: {
		accountLinking: {
			trustedProviders: [],
		},
	},
});
