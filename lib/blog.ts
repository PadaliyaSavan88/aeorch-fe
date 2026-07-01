import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: string;
  keywords: string[];
  faq: BlogFaqItem[];
  readingTime: number;
  content: string;
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt,
        author: data.author || 'Aeorch Team',
        category: data.category || 'SEO',
        keywords: data.keywords || [],
        faq: data.faq || [],
        readingTime: estimateReadingTime(content),
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPost(slug: string): BlogPost | null {
  const extensions = ['.mdx', '.md'];
  for (const ext of extensions) {
    const filePath = path.join(BLOG_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt,
        author: data.author || 'Aeorch Team',
        category: data.category || 'SEO',
        keywords: data.keywords || [],
        faq: data.faq || [],
        readingTime: estimateReadingTime(content),
        content,
      };
    }
  }
  return null;
}
