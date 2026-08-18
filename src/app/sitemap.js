import { getAllProductSlugs, getAllBlogSlugs } from '@/lib/dbQueries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export default async function sitemap() {
  const [products, blogs] = await Promise.all([
    getAllProductSlugs(),
    getAllBlogSlugs(),
  ]);

  const staticRoutes = [
    '',
    '/products',
    '/blog',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productRoutes = products.map((item) => ({
    url: `${BASE_URL}/products/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogRoutes = blogs.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}