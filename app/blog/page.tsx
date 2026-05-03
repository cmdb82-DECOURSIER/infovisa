import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { BlogPostCard } from '@/components/BlogPostCard'

export const metadata: Metadata = {
  title: 'Blog — Visa Guides & Travel Tips',
  description: 'Expert guides on visa applications, travel requirements, and tips for hassle-free international travel.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  const CATEGORIES = ['All', ...Array.from(new Set(posts.map((p) => p.category)))]

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Hero */}
      <section className="bg-black text-offwhite py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-syne text-4xl md:text-5xl font-bold mb-3">Visa Guides & Travel Tips</h1>
          <p className="text-offwhite/60 text-lg">
            Expert advice on visa applications, requirements, and international travel.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📝</div>
            <p>No posts yet. Add markdown files to <code className="bg-gray-100 px-2 py-0.5 rounded">content/blog/</code></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
