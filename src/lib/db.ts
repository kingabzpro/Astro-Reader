import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../../drizzle/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export * from '../../drizzle/schema';
