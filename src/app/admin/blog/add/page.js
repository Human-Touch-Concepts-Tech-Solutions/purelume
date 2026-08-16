import BlogForm from '@/components/BlogForm/BlogForm';

export default function AddBlogPostPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--heading, serif)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        Add New Blog Post
      </h1>
      <BlogForm/>
    </div>
  );
}