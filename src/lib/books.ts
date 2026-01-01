import fs from 'fs';
import path from 'path';

export interface BookMeta {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
}

export interface Book {
  id: string;
  meta: BookMeta;
  chapters: string[];
  coverPath: string;
}

export async function getAllBooks(): Promise<Book[]> {
  const booksDir = path.join(process.cwd(), 'src', 'content', 'books');

  if (!fs.existsSync(booksDir)) {
    return [];
  }

  const bookFolders = fs.readdirSync(booksDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const books: Book[] = [];

  for (const folder of bookFolders) {
    const book = await loadBook(folder);
    if (book) {
      books.push(book);
    }
  }

  return books;
}

export async function getBook(bookId: string): Promise<Book | null> {
  return await loadBook(bookId);
}

export async function getChapter(bookId: string, chapterSlug: string): Promise<string | null> {
  const chapterPath = path.join(
    process.cwd(),
    'src',
    'content',
    'books',
    bookId,
    'chapters',
    `${chapterSlug}.md`
  );

  if (!fs.existsSync(chapterPath)) {
    return null;
  }

  return fs.readFileSync(chapterPath, 'utf-8');
}

async function loadBook(bookId: string): Promise<Book | null> {
  const bookDir = path.join(process.cwd(), 'src', 'content', 'books', bookId);

  if (!fs.existsSync(bookDir)) {
    return null;
  }

  // Load meta.json
  const metaPath = path.join(bookDir, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    return null;
  }

  const metaContent = fs.readFileSync(metaPath, 'utf-8');
  const meta: BookMeta = JSON.parse(metaContent);

  // Get chapters
  const chaptersDir = path.join(bookDir, 'chapters');
  let chapters: string[] = [];

  if (fs.existsSync(chaptersDir)) {
    chapters = fs.readdirSync(chaptersDir)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''))
      .sort();
  }

  return {
    id: bookId,
    meta,
    chapters,
    coverPath: path.join(bookDir, 'cover.jpg'),
  };
}
