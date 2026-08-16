'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function publishBlogAction(blogPayload) {
  try {
    const { db } = await connectToDatabase();

    // 1. Clean blog title for storage path naming
    const cleanTitle = blogPayload.title.replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'blog';

    // 2. Upload Base64 images to Supabase Storage
    const uploadedImageUrls = [];

    if (blogPayload.images && blogPayload.images.length > 0) {
      for (let index = 0; index < blogPayload.images.length; index++) {
        const base64Data = blogPayload.images[index];

        // Convert base64 data URL to Buffer
        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');

        // File naming: "Gold Craftsmanship 1.jpg"
        const fileName = `blogs/${cleanTitle} ${index + 1}.jpg`;

        const { data, error } = await supabase.storage
          .from('blog') // Replace with your bucket name
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

    // 3. Replace placeholder references in the article content with actual uploaded image URLs
    let finalContent = blogPayload.content;
    uploadedImageUrls.forEach((url, index) => {
      // Replaces {{image_1}}, {{image_2}} etc. with actual <img> markdown/tags
      const placeholderRegex = new RegExp(`{{\\s*image_${index + 1}\\s*}}`, 'g');
      finalContent = finalContent.replace(
        placeholderRegex,
        `\n\n![Blog Image ${index + 1}](${url})\n\n`
      );
    });

    // 4. Construct MongoDB Blog Document
    const blogDocument = {
      title: blogPayload.title.trim(),
      slug: cleanTitle.toLowerCase().replace(/\s+/g, '-'),
      category: blogPayload.category.trim(),
      author: blogPayload.author.trim() || 'PureLume Editorial',
      content: finalContent,
      image_urls: uploadedImageUrls,
      featured_image: uploadedImageUrls[0] || null,
      links: blogPayload.links.filter(link => link.label && link.url),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 5. Save to MongoDB 'blogs' collection
    const result = await db.collection('blogs').insertOne(blogDocument);

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