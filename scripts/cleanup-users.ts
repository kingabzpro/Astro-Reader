import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function cleanupUsers() {
	console.log('Cleaning up test data...');

	try {
		// Delete all accounts, sessions, and users
		await sql`DELETE FROM account;`;
		console.log('✓ Deleted all accounts');

		await sql`DELETE FROM session;`;
		console.log('✓ Deleted all sessions');

		await sql`DELETE FROM "user";`;
		console.log('✓ Deleted all users');

		console.log('\n✅ Cleanup completed! You can now register a fresh account.');
	} catch (error) {
		console.error('❌ Cleanup failed:', error);
		process.exit(1);
	}
}

cleanupUsers();
