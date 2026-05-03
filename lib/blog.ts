import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug:        string
  title:       string
  date:        string
  author:      string
  category:    string
  excerpt:     string
  image?:      string
  readingTime: number
  content:     string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!fmMatch) return { meta: {}, body: raw }

  const meta: Record<string, string> = {}
  fmMatch[1].split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':')
    if (key) meta[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '')
  })
  return { meta, body: fmMatch[2] }
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '')
    const raw  = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { meta, body } = parseFrontmatter(raw)
    return {
      slug,
      title:       meta.title       ?? 'Untitled',
      date:        meta.date        ?? new Date().toISOString().slice(0, 10),
      author:      meta.author      ?? 'Visa Comparator',
      category:    meta.category    ?? 'General',
      excerpt:     meta.excerpt     ?? body.slice(0, 160).replace(/[#*]/g, '').trim(),
      image:       meta.image,
      readingTime: estimateReadingTime(body),
      content:     body,
    } satisfies BlogPost
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return null

  const raw  = fs.readFileSync(file, 'utf-8')
  const { meta, body } = parseFrontmatter(raw)

  return {
    slug,
    title:       meta.title       ?? 'Untitled',
    date:        meta.date        ?? new Date().toISOString().slice(0, 10),
    author:      meta.author      ?? 'Visa Comparator',
    category:    meta.category    ?? 'General',
    excerpt:     meta.excerpt     ?? body.slice(0, 160).replace(/[#*]/g, '').trim(),
    image:       meta.image,
    readingTime: estimateReadingTime(body),
    content:     body,
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category.toLowerCase() === category.toLowerCase())
}
