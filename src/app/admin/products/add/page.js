import ProductForm from '@/components/ProductForm/ProductForm';

export default function AddProductPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--heading, serif)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        Add New Product
      </h1>
      <ProductForm />
    </div>
  );
}