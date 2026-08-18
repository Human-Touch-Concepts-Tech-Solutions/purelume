import DeleteProduct from '@/components/DeleteProduct/DeleteProduct';

export default function DeleteProductPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--heading, serif)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        Delete Product
      </h1>
      <DeleteProduct />
    </div>
  );
}