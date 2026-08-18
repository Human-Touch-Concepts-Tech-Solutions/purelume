import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/dbQueries';
import { generateProductMetadata } from '@/lib/seo';
import { getProductJsonLd } from '@/lib/jsonLd';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return generateProductMetadata(product);
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = getProductJsonLd(product);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Inject JSON-LD Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <span>No image available</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-gray-500">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-emerald-600">${product.price}</p>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          <div className="mt-4">
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full ${
                product.available_quantity > 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.available_quantity > 0
                ? `In Stock (${product.available_quantity} left)`
                : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}