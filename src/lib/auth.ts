import { betterAuth } from "better-auth";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export const auth = betterAuth({
	database: db,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 6,
		maxPasswordLength: 128,
		autoSignIn: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 24 hours
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
	advanced: {
		useSecureCookies: process.env.NODE_ENV === 'production',
		crossSubDomainCookies: {
			enabled: false,
		},
	},
});
