import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function addAccountTable() {
	console.log('Adding account table for Better Auth...');

	try {
		// Create the account table
		await sql`
			CREATE TABLE IF NOT EXISTS account (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
				account_id TEXT NOT NULL,
				provider_id TEXT NOT NULL,
				access_token TEXT,
				refresh_token TEXT,
				id_token TEXT,
				access_token_expires_at TIMESTAMP,
				refresh_token_expires_at TIMESTAMP,
				scope TEXT,
				password TEXT,
				created_at TIMESTAMP DEFAULT NOW() NOT NULL,
				updated_at TIMESTAMP DEFAULT NOW() NOT NULL
			);
		`;
		console.log('✓ Account table created');

		// Add ipAddress and userAgent to session table
		await sql`
			ALTER TABLE session
			ADD COLUMN IF NOT EXISTS ip_address TEXT,
			ADD COLUMN IF NOT EXISTS user_agent TEXT;
		`;
		console.log('✓ Session table updated with ip_address and user_agent columns');

		console.log('\n✅ Migration completed successfully!');
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	}
}

addAccountTable();
