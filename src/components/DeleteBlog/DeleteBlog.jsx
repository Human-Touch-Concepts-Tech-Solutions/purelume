'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlineRefresh,
  HiOutlineDownload,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineLink,
  HiOutlineExclamationCircle,
  HiX
} from 'react-icons/hi';
import * as S from './DeleteBlogStyles';

import { getAllBlogsAction, deleteBlogAction } from '@/lib/blogActions';

const DeleteBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true);

  // Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllBlogsAction();
      if (res.success && Array.isArray(res.blogs)) {
        setBlogs(res.blogs);
        setFilteredBlogs(res.blogs);
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
        b.author?.toLowerCase().includes(term)
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  // Select blog
  const handleSelectBlog = (blog) => {
    setSelectedBlog(blog);
    setActiveImageIndex(0);
    setMobileShowSidebar(false);
  };

  // Image download handler
  const handleDownloadImage = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanTitle = (selectedBlog?.title || 'blog_image')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      link.download = `${cleanTitle}_image_${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!selectedBlog?._id && !selectedBlog?.id) return;

    const targetId = selectedBlog._id || selectedBlog.id;
    setIsDeleting(true);

    try {
      const result = await deleteBlogAction(targetId);
      if (result.success) {
        setSelectedBlog(null);
        setShowConfirmModal(false);
        await fetchBlogs();
        setMobileShowSidebar(true);
        alert(result.message || 'Blog post deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete blog post.');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      alert('An error occurred while deleting the blog post.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <S.Container>
      {/* SIDEBAR */}
      <S.Sidebar $showOnMobile={mobileShowSidebar}>
        <S.SearchInputWrapper>
          <HiOutlineSearch size={18} />
          <input
            type="text"
            placeholder="Search blogs by title, category, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </S.SearchInputWrapper>

        <S.BlogScrollList>
          {isLoading ? (
            <S.EmptyState>
              <HiOutlineRefresh size={24} className="spin" />
              <p>Loading blogs...</p>
            </S.EmptyState>
          ) : filteredBlogs.length === 0 ? (
            <S.EmptyState>
              <HiOutlineDocumentText size={28} />
              <p>No blogs found</p>
            </S.EmptyState>
          ) : (
            filteredBlogs.map((b) => {
              const id = b._id || b.id;
              const isActive = (selectedBlog?._id || selectedBlog?.id) === id;
              const thumbImage = b.featured_image || (b.image_urls && b.image_urls[0]);

              return (
                <S.BlogListItem
                  key={id}
                  $isActive={isActive}
                  onClick={() => handleSelectBlog(b)}
                >
                  <S.BlogThumb>
                    {thumbImage ? (
                      <img src={thumbImage} alt={b.title} />
                    ) : (
                      <HiOutlineDocumentText size={20} />
                    )}
                  </S.BlogThumb>

                  <S.BlogListInfo>
                    <h4>{b.title || 'Untitled Post'}</h4>
                    <p>
                      <span>{b.category || 'General'}</span>
                      <span className="author">{b.author || 'Editorial'}</span>
                    </p>
                  </S.BlogListInfo>
                </S.BlogListItem>
              );
            })
          )}
        </S.BlogScrollList>
      </S.Sidebar>

      {/* MAIN CONTENT AREA */}
      <S.Main $showOnMobile={!mobileShowSidebar}>
        {selectedBlog ? (
          <div>
            <S.HeaderToolbar>
              <div className="title-group">
                <S.MobileBackButton
                  type="button"
                  onClick={() => setMobileShowSidebar(true)}
                >
                  <HiOutlineChevronLeft />
                </S.MobileBackButton>
                <h2>Blog Details</h2>
              </div>

              <S.DeleteButton
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isDeleting}
              >
                <HiOutlineTrash size={18} /> Delete Blog
              </S.DeleteButton>
            </S.HeaderToolbar>

            <S.ContentGrid>
              {/* IMAGE GALLERY */}
              <S.GallerySection>
                {selectedBlog.image_urls && selectedBlog.image_urls.length > 0 ? (
                  <>
                    <S.MainImageWrapper>
                      <img
                        src={selectedBlog.image_urls[activeImageIndex] || selectedBlog.image_urls[0]}
                        alt={selectedBlog.title}
                      />
                      <S.DownloadOverlayButton
                        type="button"
                        title="Download Image"
                        onClick={() =>
                          handleDownloadImage(
                            selectedBlog.image_urls[activeImageIndex] || selectedBlog.image_urls[0],
                            activeImageIndex
                          )
                        }
                      >
                        <HiOutlineDownload size={18} />
                      </S.DownloadOverlayButton>
                    </S.MainImageWrapper>

                    {selectedBlog.image_urls.length > 1 && (
                      <S.ThumbnailRow>
                        {selectedBlog.image_urls.map((img, idx) => (
                          <S.ThumbnailCard
                            key={idx}
                            $isActive={activeImageIndex === idx}
                            onClick={() => setActiveImageIndex(idx)}
                          >
                            <img src={img} alt={`${selectedBlog.title} ${idx + 1}`} />
                          </S.ThumbnailCard>
                        ))}
                      </S.ThumbnailRow>
                    )}
                  </>
                ) : (
                  <S.NoImagePlaceholder>
                    <HiOutlineDocumentText size={48} />
                    <p>No images attached to this post</p>
                  </S.NoImagePlaceholder>
                )}
              </S.GallerySection>

              {/* DETAILS AND CONTENT */}
              <S.DetailsSection>
                <S.BlogTitle>{selectedBlog.title}</S.BlogTitle>

                <S.MetaGrid>
                  <S.MetaCard>
                    <HiOutlineUser className="icon" />
                    <div>
                      <label>Author</label>
                      <p>{selectedBlog.author || 'PureLume Editorial'}</p>
                    </div>
                  </S.MetaCard>

                  <S.MetaCard>
                    <HiOutlineTag className="icon" />
                    <div>
                      <label>Category</label>
                      <p>{selectedBlog.category || 'General'}</p>
                    </div>
                  </S.MetaCard>

                  <S.MetaCard>
                    <HiOutlineCalendar className="icon" />
                    <div>
                      <label>Published</label>
                      <p>
                        {selectedBlog.createdAt
                          ? new Date(selectedBlog.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </S.MetaCard>
                </S.MetaGrid>

                {selectedBlog.slug && (
                  <S.DetailRow>
                    <strong>Slug:</strong> <span>{selectedBlog.slug}</span>
                  </S.DetailRow>
                )}

                {/* ATTACHED LINKS */}
                {Array.isArray(selectedBlog.links) && selectedBlog.links.length > 0 && (
                  <S.LinksSection>
                    <label>Embedded Links:</label>
                    <S.LinkList>
                      {selectedBlog.links.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer">
                          <HiOutlineLink size={14} /> {link.label || link.url}
                        </a>
                      ))}
                    </S.LinkList>
                  </S.LinksSection>
                )}

                {/* CONTENT PREVIEW */}
                <S.ContentBox>
                  <label>Article Content</label>
                  <S.ArticleText>{selectedBlog.content || 'No content provided.'}</S.ArticleText>
                </S.ContentBox>
              </S.DetailsSection>
            </S.ContentGrid>
          </div>
        ) : (
          <S.EmptyState>
            <HiOutlineDocumentText size={48} />
            <p>Select a blog post from the list to view its full details.</p>
          </S.EmptyState>
        )}
      </S.Main>

      {/* CONFIRM DELETE MODAL */}
      {showConfirmModal && (
        <S.ModalOverlay onClick={() => !isDeleting && setShowConfirmModal(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <HiOutlineExclamationCircle size={28} className="warning-icon" />
              <h3>Delete Blog Post</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
              >
                <HiX size={20} />
              </button>
            </S.ModalHeader>

            <S.ModalBody>
              <p>
                Are you sure you want to delete <strong>"{selectedBlog?.title}"</strong>?
              </p>
              <p className="subtext">
                This action will permanently remove the blog post from MongoDB and delete all associated stored images from Supabase. This action cannot be undone.
              </p>
            </S.ModalBody>

            <S.ModalFooter>
              <S.ModalButton
                type="button"
                $variant="secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </S.ModalButton>

              <S.ModalButton
                type="button"
                $variant="danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <HiOutlineRefresh className="spin" size={16} /> Deleting...
                  </>
                ) : (
                  'Yes, Delete Blog'
                )}
              </S.ModalButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};

export default DeleteBlog;