'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);




export async function publishSingleProductAction(product) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const uploadedImageUrls = [];
    const sanitizedName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const imageData = product.image_data || [];

    // 1. Process & Upload each Base64 image to Supabase Bucket (using Admin client)
    for (let i = 0; i < imageData.length; i++) {
      const base64Data = imageData[i];
      const cleanProductName = product.name.replace(/[^a-zA-Z0-9 -]/g, '').trim();

      const fileName = `${cleanProductName} ${i + 1}.jpg`;

      // Convert Base64 string to Buffer
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

    // 2. Prepare database payload replacing image_data with uploaded URLs
    const productPayload = {
      product_id: product.product_id,
      name: product.name,
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

    // 3. Save to MongoDB
    const { db } = await connectToDatabase();
    await db.collection('products').insertOne(productPayload);

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
      id: p._id.toString(), // normalize id reference
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

      // Process images (Upload new Base64 strings, keep existing Supabase URLs)
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i];

        if (img.startsWith('data:image')) {
          // New Base64 Image -> Upload to Supabase Storage
          const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const fileName = `public/${cleanName}_${i + 1}_${Date.now()}.jpg`;

          const { error } = await supabase.storage
            .from('products') // Your Supabase bucket name
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
          // Existing Supabase URL -> Retain directly
          updatedImageUrls.push(img);
        }
      }

      // Update in MongoDB
      const filter = product._id ? { _id: new ObjectId(product._id) } : { product_id: product.product_id };

      await db.collection('products').updateOne(filter, {
        $set: {
          name: product.name,
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

    return { success: true, message: 'Products updated successfully!' };
  } catch (error) {
    console.error('updateProductBatchAction Error:', error);
    return { success: false, error: error.message };
  }
}