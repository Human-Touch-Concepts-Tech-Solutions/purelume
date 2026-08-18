'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import { revalidateTag, revalidatePath } from 'next/cache';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// Helper: Generates a clean, unique slug from product name
async function generateUniqueSlug(db, name, currentProductId = null) {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-');         // Avoid multiple hyphens

  if (!baseSlug) baseSlug = 'product';

  let slug = baseSlug;
  let counter = 1;

  // Check MongoDB for existing slug collisions
  while (true) {
    const filter = { slug };
    if (currentProductId) {
      filter.product_id = { $ne: currentProductId };
    }

    const existing = await db.collection('products').findOne(filter, { projection: { _id: 1 } });
    if (!existing) break; // Slug is unique!

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function publishSingleProductAction(product) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { db } = await connectToDatabase(); // Connect early to generate slug
    const uploadedImageUrls = [];
    const imageData = product.image_data || [];

    // 1. Generate unique slug
    const slug = await generateUniqueSlug(db, product.name, product.product_id);

    // 2. Process & Upload each Base64 image to Supabase Bucket
    for (let i = 0; i < imageData.length; i++) {
      const base64Data = imageData[i];
      const cleanProductName = product.name.replace(/[^a-zA-Z0-9 -]/g, '').trim();
      const fileName = `${cleanProductName} ${i + 1}.jpg`;

      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');

      const { error } = await supabaseAdmin.storage
        .from('products')
        .upload(`public/${fileName}`, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) throw error;

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('products')
        .getPublicUrl(`public/${fileName}`);

      uploadedImageUrls.push(publicUrlData.publicUrl);
    }

    // 3. Prepare database payload including slug
    const productPayload = {
      product_id: product.product_id,
      name: product.name,
      slug: slug, // <-- Added slug field
      description: product.description || "",
      price: Number(product.price),
      category: product.category || "",
      available_quantity: Number(product.available_quantity) || 0,
      minimum_quantity: Number(product.minimum_quantity) || 1,
      video_url: product.video_url || "",
      colors: product.colors || [],
      sizes: product.sizes || [],
      product_type: product.product_type || [],
      images: uploadedImageUrls,
      createdAt: new Date()
    };

    // 4. Save to MongoDB
    await db.collection('products').insertOne(productPayload);

    // 5. Trigger Cache Revalidation for Storefront Pages
    revalidateTag('products');
    revalidatePath('/');
    revalidatePath('/products');

    return { success: true };
  } catch (error) {
    console.error("Publish action error:", error);
    return { success: false, error: error.message };
  }
}



export async function getAllProductsAction() {
  try {
    const { db } = await connectToDatabase();
    const products = await db.collection('products').find({}).sort({ createdAt: -1 }).toArray();

    return products.map(p => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      slug: p.slug || '', // <-- Ensure slug is exposed
      colors: p.colors || [],
      sizes: p.sizes || [],
      product_type: p.product_type || [],
      images: p.images || []
    }));
  } catch (error) {
    console.error('getAllProductsAction Error:', error);
    return [];
  }
}

export async function updateProductBatchAction(modifiedProducts) {
  try {
    const { db } = await connectToDatabase();

    for (const product of modifiedProducts) {
      const cleanName = product.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const updatedImageUrls = [];

      // Generate/Update unique slug for modified product name
      const slug = await generateUniqueSlug(db, product.name, product.product_id);

      // Process images
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i];

        if (img.startsWith('data:image')) {
          const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const fileName = `public/${cleanName}_${i + 1}_${Date.now()}.jpg`;

          const { error } = await supabase.storage
            .from('products')
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (error) {
            throw new Error(`Failed to upload image for ${product.name}: ${error.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          updatedImageUrls.push(publicUrlData.publicUrl);
        } else {
          updatedImageUrls.push(img);
        }
      }

      // Update in MongoDB
      const filter = product._id ? { _id: new ObjectId(product._id) } : { product_id: product.product_id };

      await db.collection('products').updateOne(filter, {
        $set: {
          name: product.name,
          slug: slug, // <-- Added slug field update
          description: product.description,
          price: Number(product.price),
          category: product.category,
          available_quantity: Number(product.available_quantity),
          minimum_quantity: Number(product.minimum_quantity || 0),
          video_url: product.video_url || '',
          colors: Array.isArray(product.colors) ? product.colors : [],
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
          product_type: Array.isArray(product.product_type) ? product.product_type : [],
          images: updatedImageUrls,
          updatedAt: new Date()
        }
      });
    }

    // Trigger Cache Revalidation for Storefront Pages
    revalidateTag('products');
    revalidatePath('/');
    revalidatePath('/products');

    return { success: true, message: 'Products updated successfully!' };
  } catch (error) {
    console.error('updateProductBatchAction Error:', error);
    return { success: false, error: error.message };
  }
}



export async function deleteProductAction(productId) {
  try {
    const { db } = await connectToDatabase();
    const supabaseAdmin = getSupabaseAdmin();

    const filter = ObjectId.isValid(productId)
      ? { _id: new ObjectId(productId) }
      : { product_id: productId };

    const product = await db.collection('products').findOne(filter);

    if (!product) {
      return { success: false, error: 'Product not found.' };
    }

    // Storage cleanup logic
    if (Array.isArray(product.images) && product.images.length > 0) {
      const filesToDelete = product.images
        .map((url) => {
          try {
            const parsedUrl = new URL(url);
            const marker = '/storage/v1/object/public/products/';
            const index = parsedUrl.pathname.indexOf(marker);
            if (index !== -1) {
              return parsedUrl.pathname.substring(index + marker.length);
            }
            const parts = parsedUrl.pathname.split('/products/');
            return parts.length > 1 ? parts.slice(1).join('/products/') : null;
          } catch (err) {
            return null;
          }
        })
        .filter(Boolean);

      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage
          .from('products')
          .remove(filesToDelete);

        if (storageError) {
          console.warn('Supabase storage cleanup warning:', storageError.message);
        }
      }
    }

    // Delete product document from MongoDB
    await db.collection('products').deleteOne(filter);

    // Trigger Cache Revalidation after deletion
    revalidateTag('products');
    revalidatePath('/');
    revalidatePath('/products');

    return { success: true, message: 'Product deleted successfully!' };
  } catch (error) {
    console.error('deleteProductAction Error:', error);
    return { success: false, error: error.message || 'Failed to delete product.' };
  }
}