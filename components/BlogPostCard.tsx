import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-amber transition-all group">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.image && (
          <div className="h-40 bg-gray-100 overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
        )}
        {!post.image && (
          <div className="h-40 bg-gradient-to-br from-black to-gray-800 flex items-center justify-center">
            <span className="text-4xl">✈️</span>
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-amber bg-amber/10 px-2 py-0.5 rounded">{post.category}</span>
            <span className="text-xs text-gray-400">{post.readingTime} min read</span>
          </div>
          <h2 className="font-syne font-bold text-lg mb-2 group-hover:text-amber transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>
      </Link>
    </article>
  )
}
