/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly BETTER_AUTH_URL: string;
  readonly PUBLIC_BETTER_AUTH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

namespace App {
  interface Locals {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    } | null;
    session: {
      id: string;
      userId: string;
      token: string;
      expiresAt: Date;
      ipAddress: string | null;
      userAgent: string | null;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  }
}
