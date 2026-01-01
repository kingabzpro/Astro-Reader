declare global {
  namespace Astro {
    interface Locals {
      user?: {
        id: string;
        email: string;
      };
      session?: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
        user: {
          id: string;
          email: string;
        };
      };
    }
  }
}

export {};
