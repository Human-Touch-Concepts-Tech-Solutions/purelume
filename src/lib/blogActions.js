'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';
import { ObjectId } from 'mongodb';
import { revalidateTag, revalidatePath } from 'next/cache'; // 1. Added Cache Revalidation Imports

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Generates a clean, unique slug from blog title
async function generateUniqueBlogSlug(db, title, currentBlogId = null) {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-');         // Remove duplicate hyphens

  if (!baseSlug) baseSlug = 'blog-post';

  let slug = baseSlug;
  let counter = 1;

  // Check MongoDB for collisions
  while (true) {
    const filter = { slug };
    if (currentBlogId && ObjectId.isValid(currentBlogId)) {
      filter._id = { $ne: new ObjectId(currentBlogId) };
    }

    const existing = await db.collection('blogs').findOne(filter, { projection: { _id: 1 } });
    if (!existing) break; // Slug is unique!

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// 1. Publish a new blog
export async function publishBlogAction(blogPayload) {
  try {
    const { db } = await connectToDatabase();

    // Generate guaranteed unique slug
    const uniqueSlug = await generateUniqueBlogSlug(db, blogPayload.title);

    // Clean blog title for storage path naming
    const cleanTitle = blogPayload.title.replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'blog';

    // Upload Base64 images to Supabase Storage
    const uploadedImageUrls = [];

    if (blogPayload.images && blogPayload.images.length > 0) {
      for (let index = 0; index < blogPayload.images.length; index++) {
        const base64Data = blogPayload.images[index];

        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');

        const fileName = `blogs/${cleanTitle} ${index + 1}.jpg`;

        const { data, error } = await supabase.storage
          .from('blog')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (error) {
          throw new Error(`Supabase upload failed for image ${index + 1}: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('blog')
          .getPublicUrl(fileName);

        uploadedImageUrls.push(publicUrlData.publicUrl);
      }
    }

    // Replace placeholder references in article content with actual image URLs
    let finalContent = blogPayload.content;
    uploadedImageUrls.forEach((url, index) => {
      const placeholderRegex = new RegExp(`{{\\s*image_${index + 1}\\s*}}`, 'g');
      finalContent = finalContent.replace(
        placeholderRegex,
        `\n\n![Blog Image ${index + 1}](${url})\n\n`
      );
    });

    // Construct MongoDB Blog Document
    const blogDocument = {
      title: blogPayload.title.trim(),
      slug: uniqueSlug, // Collision-proof unique slug
      category: blogPayload.category.trim(),
      author: blogPayload.author.trim() || 'PureLume Editorial',
      content: finalContent,
      image_urls: uploadedImageUrls,
      featured_image: uploadedImageUrls[0] || null,
      links: blogPayload.links ? blogPayload.links.filter(link => link.label && link.url) : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('blogs').insertOne(blogDocument);

    // Trigger Cache Revalidation for Blog Routes
    revalidateTag('blogs');
    revalidatePath('/blog');
    revalidatePath('/blogs');
    revalidatePath('/');

    return {
      success: true,
      blogId: result.insertedId.toString(),
      message: 'Blog post published successfully!'
    };
  } catch (error) {
    console.error('publishBlogAction Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to publish blog post.'
    };
  }
}

// 2. Fetch all blogs
export async function getAllBlogsAction() {
  try {
    const { db } = await connectToDatabase();
    const blogs = await db.collection('blogs').find({}).sort({ createdAt: -1 }).toArray();

    return {
      success: true,
      blogs: JSON.parse(JSON.stringify(blogs))
    };
  } catch (error) {
    console.error('getAllBlogsAction Error:', error);
    return { success: false, error: error.message };
  }
}

// 3. Update an existing blog
export async function updateBlogAction(blogId, blogPayload) {
  try {
    const { db } = await connectToDatabase();

    const updateDoc = {
      $set: {
        category: blogPayload.category?.trim(),
        author: blogPayload.author?.trim(),
        content: blogPayload.content,
        links: blogPayload.links ? blogPayload.links.filter(l => l.label && l.url) : [],
        updatedAt: new Date()
      }
    };

    if (blogPayload.title) {
      updateDoc.$set.title = blogPayload.title.trim();
      // Generate unique slug for updated title
      updateDoc.$set.slug = await generateUniqueBlogSlug(db, blogPayload.title, blogId);
    }

    await db.collection('blogs').updateOne({ _id: new ObjectId(blogId) }, updateDoc);

    // Trigger Cache Revalidation
    revalidateTag('blogs');
    revalidatePath('/blog');
    revalidatePath('/blogs');
    revalidatePath('/');

    return { success: true, message: 'Blog updated successfully!' };
  } catch (error) {
    console.error('updateBlogAction Error:', error);
    return { success: false, error: error.message };
  }
}

// 4. Delete a blog (with Supabase Storage cleanup)
export async function deleteBlogAction(blogId) {
  try {
    const { db } = await connectToDatabase();

    const filter = ObjectId.isValid(blogId)
      ? { _id: new ObjectId(blogId) }
      : { _id: blogId };

    const blog = await db.collection('blogs').findOne(filter);

    if (!blog) {
      return { success: false, error: 'Blog post not found.' };
    }

    const imageUrls = blog.image_urls || [];
    if (blog.featured_image && !imageUrls.includes(blog.featured_image)) {
      imageUrls.push(blog.featured_image);
    }

    if (imageUrls.length > 0) {
      const filesToDelete = imageUrls
        .map((url) => {
          try {
            const parsedUrl = new URL(url);
            const marker = '/storage/v1/object/public/blog/';
            const index = parsedUrl.pathname.indexOf(marker);
            if (index !== -1) {
              return parsedUrl.pathname.substring(index + marker.length);
            }
            const parts = parsedUrl.pathname.split('/blog/');
            return parts.length > 1 ? parts.slice(1).join('/blog/') : null;
          } catch (err) {
            return null;
          }
        })
        .filter(Boolean);

      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('blog')
          .remove(filesToDelete);

        if (storageError) {
          console.warn('Supabase storage cleanup warning:', storageError.message);
        }
      }
    }

    await db.collection('blogs').deleteOne(filter);

    // Trigger Cache Revalidation
    revalidateTag('blogs');
    revalidatePath('/blog');
    revalidatePath('/blogs');
    revalidatePath('/');

    return { success: true, message: 'Blog post and associated images deleted successfully!' };
  } catch (error) {
    console.error('deleteBlogAction Error:', error);
    return { success: false, error: error.message || 'Failed to delete blog post.' };
  }
}