const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export function generateProductMetadata(product) {
  if (!product) {
    return {
      title: 'Product Not Found | PureLume',
      description: 'The requested product could not be found.',
    };
  }

  const title = `${product.name} | PureLume`;
  const description =
    product.description?.substring(0, 155) ||
    `Buy ${product.name} at PureLume. Premium quality and crafted designs.`;
  const canonicalUrl = `${BASE_URL}/products/${product.slug}`;
  const images = product.images && product.images.length > 0
    ? [{ url: product.images[0], alt: product.name }]
    : [];

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'PureLume',
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((img) => img.url),
    },
  };
}

export function generateBlogMetadata(blog) {
  if (!blog) {
    return {
      title: 'Post Not Found | PureLume Journal',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = `${blog.title} | PureLume Journal`;
  const plainContent = blog.content ? blog.content.replace(/[#*`_~]/g, '') : '';
  const description = plainContent.substring(0, 155) || `Read ${blog.title} on PureLume Journal.`;
  const canonicalUrl = `${BASE_URL}/blog/${blog.slug}`;
  const imageUrl = blog.featured_image || (blog.image_urls && blog.image_urls[0]);
  const images = imageUrl ? [{ url: imageUrl, alt: blog.title }] : [];

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'PureLume Journal',
      images,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author || 'PureLume Editorial'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((img) => img.url),
    },
  };
}