import EditProduct from '@/components/EditProduct/EditProduct';

export default function EditProductPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--heading, serif)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        Edit Product
      </h1>
      <EditProduct />
    </div>
  );
}