'use server';

import sharp from 'sharp';
import { getSupabaseAdmin } from '@/lib/supabase';

const TARGET_SIZE_BYTES = 800 * 1024; // 800 KB Target

/**
 * Helper to compress image buffers if they exceed target size (800KB)
 */
async function processImageCompression(buffer, mimeType) {
  // Skip compression if file is under 800KB or not an image
  if (buffer.length <= TARGET_SIZE_BYTES || !mimeType.startsWith('image/')) {
    return { buffer, contentType: mimeType };
  }

  try {
    let quality = 85;
    let compressedBuffer = await sharp(buffer)
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toBuffer();

    // Stepwise compression if still above 800 KB
    while (compressedBuffer.length > TARGET_SIZE_BYTES && quality > 20) {
      quality -= 10;
      compressedBuffer = await sharp(buffer)
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toBuffer();
    }

    return { 
      buffer: compressedBuffer, 
      contentType: 'image/jpeg' 
    };
  } catch (error) {
    console.warn('[Sharp Compression Warning]: Falling back to original file.', error);
    return { buffer, contentType: mimeType };
  }
}

/**
 * Converts incoming file representations (File, Blob, ArrayBuffer, Buffer) to Node Buffer
 */
async function toBuffer(fileInput) {
  if (Buffer.isBuffer(fileInput)) return fileInput;
  if (fileInput instanceof ArrayBuffer) return Buffer.from(fileInput);
  if (typeof fileInput.arrayBuffer === 'function') {
    const arrayBuffer = await fileInput.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  throw new Error('Unsupported file structure.');
}

/**
 * Universal Server Action to upload single or batch files to Supabase Storage.
 *
 * @param {string} bucketName - Supabase storage bucket name (e.g., 'product-media').
 * @param {File|FormData|Array} files - File, array of Files, or FormData containing files.
 * @param {string} [folderPath=''] - Subfolder destination within the bucket.
 * @returns {Promise<{success: boolean, urls: string[], errors?: Array}>}
 */
export async function uploadToSupabase(bucketName, files, folderPath = '') {
  try {
    if (!bucketName) throw new Error('Bucket name is required.');
    if (!files) throw new Error('No files provided for upload.');

    const supabaseAdmin = getSupabaseAdmin();
    
    // Normalize input to an array of file objects
    let fileList = [];
    if (files instanceof FormData) {
      fileList = files.getAll('files');
    } else if (Array.isArray(files)) {
      fileList = files;
    } else {
      fileList = [files];
    }

    const uploadedUrls = [];
    const uploadErrors = [];

    for (const file of fileList) {
      try {
        const rawBuffer = await toBuffer(file);
        const originalName = file.name || `file-${Date.now()}`;
        const mimeType = file.type || 'application/octet-stream';

        // Compress image if needed
        const { buffer, contentType } = await processImageCompression(rawBuffer, mimeType);

        // Build unique destination path
        const fileExt = contentType === 'image/jpeg' ? 'jpg' : originalName.split('.').pop();
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const destinationPath = folderPath 
          ? `${folderPath.replace(/^\/+|\/+$/g, '')}/${cleanName}` 
          : cleanName;

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
          .from(bucketName)
          .upload(destinationPath, buffer, {
            contentType,
            upsert: true,
          });

        if (error) throw error;

        // Obtain public URL for MongoDB insertion
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrlData.publicUrl);
      } catch (err) {
        console.error(`[Upload Failed for ${file.name || 'file'}]:`, err.message);
        uploadErrors.push({ fileName: file.name, error: err.message });
      }
    }

    return {
      success: uploadedUrls.length > 0,
      urls: uploadedUrls,
      errors: uploadErrors.length > 0 ? uploadErrors : undefined,
    };
  } catch (error) {
    console.error('[Supabase Storage Upload Error]:', error);
    return {
      success: false,
      urls: [],
      error: error.message || 'Storage upload process failed.',
    };
  }
}