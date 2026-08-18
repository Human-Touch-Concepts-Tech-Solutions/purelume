import { unstable_cache } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';

// --- PRODUCT DATA QUERIES ---

export const getProductBySlug = unstable_cache(
  async (slug) => {
    try {
      const { db } = await connectToDatabase();
      const product = await db.collection('products').findOne({ slug });
      return product ? JSON.parse(JSON.stringify(product)) : null;
    } catch (error) {
      console.error('getProductBySlug error:', error);
      return null;
    }
  },
  ['product-by-slug'],
  { tags: ['products'], revalidate: false }
);

export const getAllProductSlugs = unstable_cache(
  async () => {
    try {
      const { db } = await connectToDatabase();
      const products = await db
        .collection('products')
        .find({}, { projection: { slug: 1, updatedAt: 1 } })
        .toArray();
      return JSON.parse(JSON.stringify(products));
    } catch (error) {
      console.error('getAllProductSlugs error:', error);
      return [];
    }
  },
  ['all-product-slugs'],
  { tags: ['products'], revalidate: false }
);

// --- BLOG DATA QUERIES ---

export const getBlogBySlug = unstable_cache(
  async (slug) => {
    try {
      const { db } = await connectToDatabase();
      const blog = await db.collection('blogs').findOne({ slug });
      return blog ? JSON.parse(JSON.stringify(blog)) : null;
    } catch (error) {
      console.error('getBlogBySlug error:', error);
      return null;
    }
  },
  ['blog-by-slug'],
  { tags: ['blogs'], revalidate: false }
);

export const getAllBlogSlugs = unstable_cache(
  async () => {
    try {
      const { db } = await connectToDatabase();
      const blogs = await db
        .collection('blogs')
        .find({}, { projection: { slug: 1, updatedAt: 1 } })
        .toArray();
      return JSON.parse(JSON.stringify(blogs));
    } catch (error) {
      console.error('getAllBlogSlugs error:', error);
      return [];
    }
  },
  ['all-blog-slugs'],
  { tags: ['blogs'], revalidate: false }
);

// Add this to your existing lib/dbQueries.js

export const getProductsByCategory = unstable_cache(
  async (categorySlug) => {
    try {
      const { db } = await connectToDatabase();
      
      // Convert "wedding-gifts" or "bracelets" slug format to regex query
      const formattedCategory = categorySlug.replace(/-/g, ' ');
      
      const products = await db
        .collection('products')
        .find({
          category: { $regex: new RegExp(`^${formattedCategory}$`, 'i') }
        })
        .sort({ createdAt: -1 })
        .toArray();

      return JSON.parse(JSON.stringify(products));
    } catch (error) {
      console.error('getProductsByCategory error:', error);
      return [];
    }
  },
  ['products-by-category'],
  { tags: ['products'], revalidate: false }
);