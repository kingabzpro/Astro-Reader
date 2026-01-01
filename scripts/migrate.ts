import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function runMigrations() {
  console.log('Running database migrations...');

  // Create user table
  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "email" text NOT NULL,
      "email_verified" boolean DEFAULT false NOT NULL,
      "name" text,
      "image" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "user_email_unique" UNIQUE("email")
    );
  `;
  console.log('✓ Created user table');

  // Create session table
  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" uuid NOT NULL,
      "expires_at" timestamp NOT NULL,
      "token" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "session_token_unique" UNIQUE("token")
    );
  `;
  console.log('✓ Created session table');

  // Create reader_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS "reader_settings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" uuid NOT NULL,
      "theme" text DEFAULT 'system' NOT NULL,
      "font_size" text DEFAULT '18' NOT NULL,
      "line_height" text DEFAULT '1.6' NOT NULL,
      "content_width" text DEFAULT '720' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `;
  console.log('✓ Created reader_settings table');

  // Create reading_progress table
  await sql`
    CREATE TABLE IF NOT EXISTS "reading_progress" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" uuid NOT NULL,
      "book_id" text NOT NULL,
      "chapter_id" text NOT NULL,
      "scroll_position" double precision DEFAULT 0 NOT NULL,
      "last_read_at" timestamp DEFAULT now() NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `;
  console.log('✓ Created reading_progress table');

  // Add foreign key constraints
  try {
    await sql`
      ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    `;
    console.log('✓ Added session foreign key');
  } catch (e: any) {
    if (!e.message.includes('already exists')) console.log('Note:', e.message);
  }

  try {
    await sql`
      ALTER TABLE "reader_settings" ADD CONSTRAINT "reader_settings_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    `;
    console.log('✓ Added reader_settings foreign key');
  } catch (e: any) {
    if (!e.message.includes('already exists')) console.log('Note:', e.message);
  }

  try {
    await sql`
      ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    `;
    console.log('✓ Added reading_progress foreign key');
  } catch (e: any) {
    if (!e.message.includes('already exists')) console.log('Note:', e.message);
  }

  console.log('\n✅ All migrations completed successfully!');
}

runMigrations().catch(console.error);
