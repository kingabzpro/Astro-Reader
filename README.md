# Astro-Reader

Build a fast, polished "online book reader" website using Astro + Starlight.

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Database**: [Neon PostgreSQL](https://neon.tech)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [Better Auth](https://www.better-auth.com) with Neon Auth
- **Deployment**: [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon account (create one at [https://neon.tech](https://neon.tech))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Astro-Reader
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Database
DATABASE_URL=postgresql://[user]:[password]@[project-id].neon.tech/neondb?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
PUBLIC_BETTER_AUTH_URL=http://localhost:4321
```

To generate a `BETTER_AUTH_SECRET`:
```bash
openssl rand -base64 32
```

5. Run database migrations:
```bash
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── drizzle/
│   └── schema.ts          # Database schema definitions
├── src/
│   ├── components/        # Astro components
│   ├── lib/
│   │   ├── auth.ts        # Better Auth server configuration
│   │   ├── auth-client.ts # Better Auth client configuration
│   │   ├── db.ts          # Database connection
│   │   ├── database.ts    # Database helper functions
│   │   └── middleware.ts  # Authentication middleware
│   ├── layouts/           # Astro layouts
│   └── pages/             # Astro pages & API routes
└── scripts/
    └── migrate.ts         # Database migration script
```

## Database Schema

The application uses the following tables:

- **user** - User accounts (managed by Better Auth)
- **session** - User sessions (managed by Better Auth)
- **reader_settings** - Reader preferences (theme, font size, etc.)
- **reading_progress** - Track reading position in books

## Authentication

This app uses Better Auth with Neon Auth backend:

- Email/password authentication
- Session-based auth with secure cookies
- Protected routes require authentication
- Public routes: `/login`, `/register`, `/logout`, `/api/auth`

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL=your-production-database-url
BETTER_AUTH_SECRET=your-production-secret
PUBLIC_BETTER_AUTH_URL=https://your-domain.com
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema to Neon
- `npm run db:studio` - Open Drizzle Studio

## License

MIT
