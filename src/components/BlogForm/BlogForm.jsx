'use client';

import { useState, useRef } from 'react';
import { publishBlogAction } from '@/lib/blogActions';
import { 
  HiOutlinePhotograph, 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiX,
  HiOutlineCode
} from 'react-icons/hi';
import * as S from './BlogFormStyles';

const BlogForm = () => {
  const [blogData, setBlogData] = useState({
    title: '',
    category: '',
    author: 'PureLume Editorial',
    content: ''
  });

  const [images, setImages] = useState([]); // File/Base64 objects
  const [previews, setPreviews] = useState([]); // Preview URLs
  const [links, setLinks] = useState([{ label: '', url: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef(null);

  // Client-side image compression
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1600; // High resolution for blog displays

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const compressed = await Promise.all(files.map(file => compressImage(file)));
    setImages(prev => [...prev, ...compressed]);
    setPreviews(prev => [...prev, ...compressed]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // Helper to insert image placeholder at cursor position
  const insertImagePlaceholder = (index) => {
    const placeholder = `\n{{image_${index + 1}}}\n`;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = blogData.content;

    const updatedText = currentText.substring(0, start) + placeholder + currentText.substring(end);
    setBlogData({ ...blogData, content: updatedText });

    // Refocus cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
    }, 50);
  };

  // Links Handlers
  const addLink = () => setLinks([...links, { label: '', url: '' }]);
  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };
  const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blogData.title.trim() || !blogData.content.trim()) {
      alert("Please provide a Title and Article Body.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...blogData,
        images, // Base64 array
        links
      };

      const response = await publishBlogAction(payload);

      if (response.success) {
        alert("Blog Post Published Successfully!");
        // Reset Form
        setBlogData({ title: '', category: '', author: 'PureLume Editorial', content: '' });
        setImages([]);
        setPreviews([]);
        setLinks([{ label: '', url: '' }]);
      } else {
        alert(`Error publishing post: ${response.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while publishing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.FormContainer onSubmit={handleSubmit}>
      {isSubmitting && (
        <S.ProgressModal>
          <S.ProgressBox>
            <S.Spinner />
            <h4>Publishing Blog Post...</h4>
            <p>Uploading images to storage & saving article.</p>
          </S.ProgressBox>
        </S.ProgressModal>
      )}

      {/* Main Content */}
      <S.Section>
        <h3>Main Content</h3>
        <S.FormGroup>
          <label>Blog Title *</label>
          <input 
            type="text" 
            placeholder="e.g. The Evolution of Gold Craftsmanship" 
            value={blogData.title}
            onChange={(e) => setBlogData({...blogData, title: e.target.value})}
            required 
          />
        </S.FormGroup>

        <S.GridTwoCols>
          <S.FormGroup>
            <label>Category</label>
            <input 
              type="text" 
              placeholder="e.g. Jewelry Trends, Care Guides" 
              value={blogData.category}
              onChange={(e) => setBlogData({...blogData, category: e.target.value})}
            />
          </S.FormGroup>

          <S.FormGroup>
            <label>Author</label>
            <input 
              type="text" 
              placeholder="e.g. PureLume Editorial" 
              value={blogData.author}
              onChange={(e) => setBlogData({...blogData, author: e.target.value})}
            />
          </S.FormGroup>
        </S.GridTwoCols>

        <S.FormGroup>
          <S.LabelRow>
            <label>Article Body *</label>
            <small>Use <code>{"{{image_1}}"}</code> to insert Image 1 anywhere in the content.</small>
          </S.LabelRow>

          {/* Quick Insert Buttons for Uploaded Images */}
          {previews.length > 0 && (
            <S.ImageInsertBar>
              <span>Quick Insert Image:</span>
              {previews.map((_, i) => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => insertImagePlaceholder(i)}
                >
                  <HiOutlineCode /> Image {i + 1}
                </button>
              ))}
            </S.ImageInsertBar>
          )}

          <textarea 
            ref={textareaRef}
            placeholder="Write your story... You can paste HTML or Markdown here." 
            value={blogData.content}
            onChange={(e) => setBlogData({...blogData, content: e.target.value})}
            required
          />
        </S.FormGroup>
      </S.Section>

      {/* Media */}
      <S.Section>
        <h3>Article Media</h3>
        <S.ImageGrid>
          {previews.map((src, i) => (
            <S.Preview key={i}>
              <img src={src} alt={`Preview ${i + 1}`} />
              <S.Badge>Image {i + 1}</S.Badge>
              <button type="button" onClick={() => removeImage(i)}><HiX /></button>
            </S.Preview>
          ))}
          <S.ImageBox>
            <HiOutlinePhotograph size={30} />
            <span>Add Media</span>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          </S.ImageBox>
        </S.ImageGrid>
      </S.Section>

      {/* Resources & External Links */}
      <S.Section>
        <h3>Resources & Links</h3>
        {links.map((link, i) => (
          <S.LinkRow key={i}>
            <div className="label-input">
              <label>Label</label>
              <input 
                type="text" 
                placeholder="Source Name" 
                value={link.label}
                onChange={(e) => updateLink(i, 'label', e.target.value)}
              />
            </div>
            <div className="url-input">
              <label>URL</label>
              <input 
                type="url" 
                placeholder="https://..." 
                value={link.url}
                onChange={(e) => updateLink(i, 'url', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => removeLink(i)}>
              <HiOutlineTrash />
            </button>
          </S.LinkRow>
        ))}
        <S.AddButton type="button" onClick={addLink}>
          <HiOutlinePlus /> Add External Link
        </S.AddButton>
      </S.Section>

      <S.SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Publishing..." : "Publish Blog Post"}
      </S.SubmitButton>
    </S.FormContainer>
  );
};

export default BlogForm;