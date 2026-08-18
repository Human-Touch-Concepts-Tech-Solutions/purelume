import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/dbQueries';
import { generateBlogMetadata } from '@/lib/seo';
import { getBlogJsonLd } from '@/lib/jsonLd';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return generateBlogMetadata(blog);
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const jsonLd = getBlogJsonLd(blog);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Inject JSON-LD Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8">
        <span className="text-xs uppercase tracking-widest text-emerald-600 font-semibold">
          {blog.category}
        </span>
        <h1 className="text-4xl font-extrabold mt-2 mb-4">{blog.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>By {blog.author || 'PureLume Editorial'}</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      {blog.featured_image && (
        <div className="mb-8">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none whitespace-pre-line text-gray-800">
        {blog.content}
      </div>
    </article>
  );
}