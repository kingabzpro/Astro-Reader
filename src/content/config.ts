import { defineCollection } from 'astro:content';

const books = defineCollection({
  loader: async () => {
    // Custom loader for books - we'll handle this in our books.ts utility
    return [];
  },
});

export const collections = { books };
