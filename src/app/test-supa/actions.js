'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

export async function testSupabaseConnection() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Check if 'products' bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw listError;

    const bucketExists = buckets.some(b => b.name === 'products');

    if (!bucketExists) {
      return { 
        success: false, 
        message: "Connected to Supabase, but 'products' bucket was not found. Please create a public bucket named 'products' in your Supabase dashboard." 
      };
    }

    // 2. Upload a lightweight text file to verify write access
    const testBuffer = Buffer.from('Supabase connection test successful!');
    const fileName = `test/connection-check-${Date.now()}.txt`;

    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('products')
      .upload(fileName, testBuffer, { contentType: 'text/plain', upsert: true });

    if (uploadError) throw uploadError;

    // 3. Get public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from('products')
      .getPublicUrl(fileName);

    return {
      success: true,
      message: "Successfully connected, uploaded test file, and generated public URL!",
      publicUrl: urlData.publicUrl
    };

  } catch (error) {
    return { success: false, message: error.message };
  }
}