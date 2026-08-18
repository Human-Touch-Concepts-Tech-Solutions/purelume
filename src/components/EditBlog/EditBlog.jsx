'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineSearch,
  HiOutlineSave,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlinePhotograph,
  HiOutlineLink,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineRefresh,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiPlus,
  HiX
} from 'react-icons/hi';
import * as S from './EditBlogStyles';

import { getAllBlogsAction, updateBlogAction, deleteBlogAction } from '@/lib/blogActions';

// Helper: Parse raw markdown string into blocks (Text vs Image)
const parseContentToBlocks = (content = '') => {
  if (!content) return [{ id: 'block-0', type: 'text', value: '' }];

  const regex = /(!\[.*?\]\((.*?)\))/g;
  const blocks = [];
  let lastIndex = 0;
  let match;
  let count = 0;

  while ((match = regex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim() || lastIndex === 0) {
      blocks.push({
        id: `block-${count++}`,
        type: 'text',
        value: textBefore
      });
    }

    blocks.push({
      id: `block-${count++}`,
      type: 'image',
      url: match[2],
      alt: match[1]
    });

    lastIndex = regex.lastIndex;
  }

  const remainingText = content.substring(lastIndex);
  if (remainingText || blocks.length === 0) {
    blocks.push({
      id: `block-${count++}`,
      type: 'text',
      value: remainingText
    });
  }

  return blocks;
};

// Helper: Convert array of blocks back into markdown standard string
const serializeBlocksToMarkdown = (blocks = []) => {
  return blocks
    .map((block, idx) => {
      if (block.type === 'image') {
        return `\n\n![Blog Image ${idx + 1}](${block.url})\n\n`;
      }
      return block.value;
    })
    .join('');
};

const EditBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllBlogsAction();
      if (data?.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
        setFilteredBlogs(data.blogs);
      } else if (Array.isArray(data)) {
        setBlogs(data);
        setFilteredBlogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBlogs(blogs);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(term) ||
        b.category?.toLowerCase().includes(term) ||
        b.slug?.toLowerCase().includes(term)
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  // Handle selecting a blog
  const handleSelectBlog = (blog) => {
    const rawContent = blog.content || '';
    setSelectedBlog({
      _id: blog._id?.$oid || blog._id || '',
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || '',
      author: blog.author || '',
      featured_image: blog.featured_image || '',
      image_urls: Array.isArray(blog.image_urls) ? blog.image_urls : [],
      links: Array.isArray(blog.links) ? blog.links : []
    });

    setContentBlocks(parseContentToBlocks(rawContent));
    setMobileShowSidebar(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBlog((prev) => ({
      ...prev,
      [name]: value ?? ''
    }));
  };

  const handleGenerateSlug = () => {
    if (!selectedBlog?.title) return;
    const generatedSlug = selectedBlog.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setSelectedBlog((prev) => ({ ...prev, slug: generatedSlug }));
  };

  // Content Block Management
  const handleBlockTextChange = (id, newValue) => {
    setContentBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, value: newValue } : b))
    );
  };

  const handleInsertImageBlock = (url) => {
    setContentBlocks((prev) => [
      ...prev,
      {
        id: `block-${Date.now()}`,
        type: 'image',
        url
      },
      {
        id: `block-${Date.now() + 1}`,
        type: 'text',
        value: '\n'
      }
    ]);
  };

  const handleMoveBlock = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= contentBlocks.length) return;

    const updated = [...contentBlocks];
    const [movedBlock] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedBlock);
    setContentBlocks(updated);
  };

  const handleRemoveBlock = (id) => {
    setContentBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Gallery Management
  const handleSetFeaturedImage = (url) => {
    setSelectedBlog((prev) => ({ ...prev, featured_image: url }));
  };

  const handleRemoveImageFromGallery = (urlToRemove) => {
    setSelectedBlog((prev) => {
      const updatedUrls = prev.image_urls.filter((url) => url !== urlToRemove);
      return {
        ...prev,
        image_urls: updatedUrls,
        featured_image:
          prev.featured_image === urlToRemove ? updatedUrls[0] || '' : prev.featured_image
      };
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setSelectedBlog((prev) => {
      const exists = prev.image_urls.includes(newImageUrl.trim());
      const updatedUrls = exists ? prev.image_urls : [...prev.image_urls, newImageUrl.trim()];
      return {
        ...prev,
        image_urls: updatedUrls,
        featured_image: prev.featured_image || newImageUrl.trim()
      };
    });
    setNewImageUrl('');
  };

  // Reference links
  const handleAddLink = () => {
    setSelectedBlog((prev) => ({ ...prev, links: [...prev.links, ''] }));
  };

  const handleLinkChange = (index, value) => {
    setSelectedBlog((prev) => {
      const updatedLinks = [...prev.links];
      updatedLinks[index] = value;
      return { ...prev, links: updatedLinks };
    });
  };

  const handleRemoveLink = (index) => {
    setSelectedBlog((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedBlog) return;

    setIsSaving(true);
    const finalContent = serializeBlocksToMarkdown(contentBlocks);

    try {
      await updateBlogAction(selectedBlog._id, {
        ...selectedBlog,
        content: finalContent
      });
      await fetchBlogs();
      alert('Blog post updated successfully!');
    } catch (err) {
      console.error('Failed to update blog:', err);
      alert('Error updating blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete blog
  const handleDelete = async () => {
    if (!selectedBlog?._id) return;
    if (!window.confirm(`Are you sure you want to delete "${selectedBlog.title}"?`)) return;

    setIsSaving(true);
    try {
      await deleteBlogAction(selectedBlog._id);
      setSelectedBlog(null);
      setContentBlocks([]);
      await fetchBlogs();
      setMobileShowSidebar(true);
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Error deleting blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <S.Container>
      {/* SIDEBAR */}
      <S.BlogListSidebar $showOnMobile={mobileShowSidebar}>
        <S.SearchInputWrapper>
          <HiOutlineSearch size={18} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </S.SearchInputWrapper>

        <S.BlogScrollList>
          {isLoading ? (
            <S.EmptyState>
              <HiOutlineRefresh size={24} className="spin" />
              <p>Loading posts...</p>
            </S.EmptyState>
          ) : filteredBlogs.length === 0 ? (
            <S.EmptyState>
              <HiOutlineDocumentText size={28} />
              <p>No blog posts found</p>
            </S.EmptyState>
          ) : (
            filteredBlogs.map((blog) => {
              const id = blog._id?.$oid || blog._id;
              const isActive = selectedBlog?._id === id;
              return (
                <S.BlogListItem
                  key={id}
                  $isActive={isActive}
                  onClick={() => handleSelectBlog(blog)}
                >
                  <h4>{blog.title || 'Untitled Post'}</h4>
                  <p>
                    <span>{blog.category || 'General'}</span>
                    <span>{blog.author || 'Admin'}</span>
                  </p>
                </S.BlogListItem>
              );
            })
          )}
        </S.BlogScrollList>
      </S.BlogListSidebar>

      {/* EDITOR */}
      <S.EditorMain $showOnMobile={!mobileShowSidebar}>
        {selectedBlog ? (
          <form onSubmit={handleSave}>
            <S.HeaderToolbar>
              <div className="title-group">
                <S.MobileBackButton
                  type="button"
                  onClick={() => setMobileShowSidebar(true)}
                >
                  <HiOutlineChevronLeft />
                </S.MobileBackButton>
                <h2>Edit Blog Post</h2>
              </div>

              <div className="action-buttons">
                <S.Button
                  type="button"
                  $variant="danger"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  <HiOutlineTrash /> Delete
                </S.Button>

                <S.Button type="submit" $variant="primary" disabled={isSaving}>
                  <HiOutlineSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                </S.Button>
              </div>
            </S.HeaderToolbar>

            <S.FormGrid style={{ marginTop: '1.25rem' }}>
              <S.FormGroup $fullWidth>
                <label>Blog Title *</label>
                <input
                  name="title"
                  type="text"
                  value={selectedBlog.title || ''}
                  onChange={handleInputChange}
                  required
                />
              </S.FormGroup>

              <S.FormGroup $fullWidth>
                <label>Slug *</label>
                <S.SlugWrapper>
                  <input
                    name="slug"
                    type="text"
                    value={selectedBlog.slug || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <S.Button type="button" onClick={handleGenerateSlug}>
                    Auto-Generate
                  </S.Button>
                </S.SlugWrapper>
              </S.FormGroup>

              <S.FormGroup>
                <label>Category</label>
                <input
                  name="category"
                  type="text"
                  value={selectedBlog.category || ''}
                  onChange={handleInputChange}
                />
              </S.FormGroup>

              <S.FormGroup>
                <label>Author</label>
                <input
                  name="author"
                  type="text"
                  value={selectedBlog.author || ''}
                  onChange={handleInputChange}
                />
              </S.FormGroup>
            </S.FormGrid>

            {/* GALLERY */}
            <S.SectionTitle>
              <span>Image Gallery & Featured Banner</span>
            </S.SectionTitle>

            <S.FormGroup $fullWidth style={{ marginBottom: '0.75rem' }}>
              <S.SlugWrapper>
                <input
                  type="url"
                  placeholder="Paste image URL to add to gallery..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <S.Button type="button" onClick={handleAddImageUrl}>
                  <HiPlus /> Add Image
                </S.Button>
              </S.SlugWrapper>
            </S.FormGroup>

            <S.ImageGalleryGrid>
              {selectedBlog.image_urls.map((url, idx) => {
                const isFeatured = selectedBlog.featured_image === url;
                return (
                  <S.ImageCard key={idx} $isFeatured={isFeatured}>
                    <img src={url} alt={`Gallery ${idx + 1}`} />
                    {isFeatured && <span className="badge">Featured</span>}

                    <div className="overlay">
                      <S.OverlayIconButton
                        type="button"
                        title="Set as Featured Image"
                        onClick={() => handleSetFeaturedImage(url)}
                      >
                        <HiOutlineStar />
                      </S.OverlayIconButton>

                      <S.OverlayIconButton
                        type="button"
                        title="Insert into Article Content"
                        onClick={() => handleInsertImageBlock(url)}
                      >
                        <HiOutlinePhotograph />
                      </S.OverlayIconButton>

                      <S.OverlayIconButton
                        type="button"
                        title="Remove Image"
                        onClick={() => handleRemoveImageFromGallery(url)}
                      >
                        <HiX />
                      </S.OverlayIconButton>
                    </div>
                  </S.ImageCard>
                );
              })}
            </S.ImageGalleryGrid>

            {/* BLOCK CONTENT EDITOR */}
            <S.SectionTitle>Article Content & Embedded Media</S.SectionTitle>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {contentBlocks.map((block, idx) => {
                if (block.type === 'image') {
                  return (
                    <S.EmbeddedImageBlock key={block.id}>
                      <div className="img-preview">
                        <img src={block.url} alt="Article media" />
                        <span>Embedded Image #{idx + 1}</span>
                      </div>

                      <div className="block-actions">
                        <S.IconButton
                          type="button"
                          onClick={() => handleMoveBlock(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          <HiOutlineArrowUp />
                        </S.IconButton>

                        <S.IconButton
                          type="button"
                          onClick={() => handleMoveBlock(idx, 'down')}
                          disabled={idx === contentBlocks.length - 1}
                          title="Move Down"
                        >
                          <HiOutlineArrowDown />
                        </S.IconButton>

                        <S.IconButton
                          type="button"
                          $variant="danger"
                          onClick={() => handleRemoveBlock(block.id)}
                          title="Remove Image Block"
                        >
                          <HiX />
                        </S.IconButton>
                      </div>
                    </S.EmbeddedImageBlock>
                  );
                }

                return (
                  <S.MarkdownTextArea
                    key={block.id}
                    value={block.value}
                    onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
                    placeholder="Write your article text here..."
                    rows={Math.max(3, (block.value.match(/\n/g) || []).length + 2)}
                  />
                );
              })}
            </div>

            {/* REFERENCE LINKS */}
            <S.SectionTitle style={{ marginTop: '1.5rem' }}>
              <span>Reference Links</span>
              <S.Button type="button" onClick={handleAddLink}>
                <HiPlus /> Add Link
              </S.Button>
            </S.SectionTitle>

            <S.LinkList>
              {selectedBlog.links.map((link, idx) => (
                <S.LinkRow key={idx}>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link || ''}
                    onChange={(e) => handleLinkChange(idx, e.target.value)}
                  />
                  <S.Button
                    type="button"
                    $variant="danger"
                    onClick={() => handleRemoveLink(idx)}
                  >
                    <HiX />
                  </S.Button>
                </S.LinkRow>
              ))}
            </S.LinkList>
          </form>
        ) : (
          <S.EmptyState>
            <HiOutlineDocumentText size={48} />
            <p>Select a blog post from the sidebar to edit its content.</p>
          </S.EmptyState>
        )}
      </S.EditorMain>
    </S.Container>
  );
};

export default EditBlog;