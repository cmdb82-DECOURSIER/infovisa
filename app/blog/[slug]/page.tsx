import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/lib/blog'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: 'Post not found' }
  return { title: post.title, description: post.excerpt }
}

// Simple markdown-to-html (no external dep required)
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="font-syne text-xl font-bold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-syne text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-syne text-3xl font-bold mt-12 mb-5">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-amber hover:underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[h|l|p])(.+)$/gm, '<p class="mb-4">$1</p>')
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const html = renderMarkdown(post.content)

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Hero */}
      <section className="bg-black text-offwhite py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-offwhite/50 text-sm mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-offwhite">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-offwhite">Blog</Link>
            <span>/</span>
            <span className="text-offwhite">{post.title}</span>
          </nav>
          <div className="mb-4">
            <span className="text-xs font-mono text-amber bg-amber/20 px-3 py-1 rounded-full">{post.category}</span>
          </div>
          <h1 className="font-syne text-3xl md:text-5xl font-bold mb-5 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-3 text-offwhite/60 text-sm">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-3">Share this article</p>
          <div className="flex gap-3">
            {[
              { label: 'Twitter/X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://visa-comparator.com/blog/${post.slug}`)}` },
              { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://visa-comparator.com/blog/${post.slug}`)}` },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-amber hover:text-amber transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-black text-offwhite rounded-2xl p-8 text-center">
          <h3 className="font-syne text-2xl font-bold mb-2">Check Visa Requirements</h3>
          <p className="text-offwhite/60 mb-5">Use our free tool to check requirements for your specific route.</p>
          <Link href="/compare" className="inline-flex px-6 py-3 bg-amber text-black font-syne font-bold rounded-lg hover:bg-amber-light transition-colors">
            Compare Visas →
          </Link>
        </div>
      </article>
    </div>
  )
}
