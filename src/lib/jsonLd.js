const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export function getProductJsonLd(product) {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description || '',
    sku: product._id.toString(),
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.available_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };
}

export function getBlogJsonLd(blog) {
  if (!blog) return null;

  const imageUrl = blog.featured_image || (blog.image_urls && blog.image_urls[0]);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: imageUrl ? [imageUrl] : [],
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author || 'PureLume Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PureLume',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    description: blog.content ? blog.content.substring(0, 200).replace(/[#*`_~]/g, '') : '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${blog.slug}`,
    },
  };
}