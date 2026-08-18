import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/lib/dbQueries';
import Category from '@/components/Category/Category';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

// Generate Server-Side SEO Metadata
export async function generateMetadata({ params }) {
  const { category } = await params;
  const formattedTitle = category.replace(/-/g, ' ');

  return {
    title: `${formattedTitle} Collection | PureLume`,
    description: `Explore our premium collection of ${formattedTitle}. Handcrafted quality, unique designs, and fast delivery.`,
    alternates: {
      canonical: `${BASE_URL}/categories/${category}`,
    },
    openGraph: {
      title: `${formattedTitle} | PureLume`,
      description: `Browse our curated ${formattedTitle} collection.`,
      url: `${BASE_URL}/categories/${category}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params; // Captures slug e.g. "wedding-gifts", "bracelets"
  const formattedCategoryName = category.replace(/-/g, ' ');

  // Fetch products matching category from MongoDB via Edge Cache
  const products = await getProductsByCategory(category);

  if (!products) {
    notFound();
  }

  // Generate Category ItemList Schema.org JSON-LD
  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: formattedCategoryName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}/products/${product.slug}`,
      name: product.name,
    })),
  };

  return (
    <main>
      {/* Category JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />

      <Category
        categoryName={formattedCategoryName}
        products={products}
      />
    </main>
  );
}