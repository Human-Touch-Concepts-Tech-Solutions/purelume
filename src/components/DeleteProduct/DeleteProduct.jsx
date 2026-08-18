'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlineRefresh,
  HiOutlineDownload,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
  HiOutlineVideoCamera,
  HiOutlineExclamationCircle,
  HiX
} from 'react-icons/hi';
import * as S from './DeleteProductStyles';

import { getAllProductsAction, deleteProductAction } from '@/lib/actions';

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllProductsAction();
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.product_id?.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Select product
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setMobileShowSidebar(false);
  };

  // Trigger download for an image
  const handleDownloadImage = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanName = (selectedProduct?.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      link.download = `${cleanName}_image_${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: direct open in new tab if blob fetch fails
      window.open(imageUrl, '_blank');
    }
  };

  // Perform product deletion
  const handleConfirmDelete = async () => {
    if (!selectedProduct?._id && !selectedProduct?.id && !selectedProduct?.product_id) return;

    const targetId = selectedProduct._id || selectedProduct.id || selectedProduct.product_id;
    setIsDeleting(true);

    try {
      const result = await deleteProductAction(targetId);
      if (result.success) {
        setSelectedProduct(null);
        setShowConfirmModal(false);
        await fetchProducts();
        setMobileShowSidebar(true);
        alert(result.message || 'Product deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('An error occurred while deleting the product.');
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </S.SearchInputWrapper>

        <S.ProductScrollList>
          {isLoading ? (
            <S.EmptyState>
              <HiOutlineRefresh size={24} className="spin" />
              <p>Loading products...</p>
            </S.EmptyState>
          ) : filteredProducts.length === 0 ? (
            <S.EmptyState>
              <HiOutlineCube size={28} />
              <p>No products found</p>
            </S.EmptyState>
          ) : (
            filteredProducts.map((p) => {
              const id = p._id || p.id || p.product_id;
              const isActive = (selectedProduct?._id || selectedProduct?.id || selectedProduct?.product_id) === id;
              return (
                <S.ProductListItem
                  key={id}
                  $isActive={isActive}
                  onClick={() => handleSelectProduct(p)}
                >
                  <S.ProductThumb>
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} />
                    ) : (
                      <HiOutlineCube size={20} />
                    )}
                  </S.ProductThumb>

                  <S.ProductListInfo>
                    <h4>{p.name || 'Untitled Product'}</h4>
                    <p>
                      <span>{p.category || 'Uncategorized'}</span>
                      <span className="price">${Number(p.price || 0).toFixed(2)}</span>
                    </p>
                  </S.ProductListInfo>
                </S.ProductListItem>
              );
            })
          )}
        </S.ProductScrollList>
      </S.Sidebar>

      {/* MAIN DETAILS AREA */}
      <S.Main $showOnMobile={!mobileShowSidebar}>
        {selectedProduct ? (
          <div>
            <S.HeaderToolbar>
              <div className="title-group">
                <S.MobileBackButton
                  type="button"
                  onClick={() => setMobileShowSidebar(true)}
                >
                  <HiOutlineChevronLeft />
                </S.MobileBackButton>
                <h2>Product Details</h2>
              </div>

              <S.DeleteButton
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isDeleting}
              >
                <HiOutlineTrash size={18} /> Delete Product
              </S.DeleteButton>
            </S.HeaderToolbar>

            <S.ContentGrid>
              {/* IMAGE GALLERY */}
              <S.GallerySection>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <>
                    <S.MainImageWrapper>
                      <img
                        src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                        alt={selectedProduct.name}
                      />
                      <S.DownloadOverlayButton
                        type="button"
                        title="Download Image"
                        onClick={() =>
                          handleDownloadImage(
                            selectedProduct.images[activeImageIndex] || selectedProduct.images[0],
                            activeImageIndex
                          )
                        }
                      >
                        <HiOutlineDownload size={18} />
                      </S.DownloadOverlayButton>
                    </S.MainImageWrapper>

                    {selectedProduct.images.length > 1 && (
                      <S.ThumbnailRow>
                        {selectedProduct.images.map((img, idx) => (
                          <S.ThumbnailCard
                            key={idx}
                            $isActive={activeImageIndex === idx}
                            onClick={() => setActiveImageIndex(idx)}
                          >
                            <img src={img} alt={`${selectedProduct.name} ${idx + 1}`} />
                          </S.ThumbnailCard>
                        ))}
                      </S.ThumbnailRow>
                    )}
                  </>
                ) : (
                  <S.NoImagePlaceholder>
                    <HiOutlineCube size={48} />
                    <p>No images available for this product</p>
                  </S.NoImagePlaceholder>
                )}
              </S.GallerySection>

              {/* PRODUCT SPECIFICATIONS */}
              <S.DetailsSection>
                <S.ProductTitle>{selectedProduct.name}</S.ProductTitle>

                <S.MetaGrid>
                  <S.MetaCard>
                    <HiOutlineCurrencyDollar className="icon" />
                    <div>
                      <label>Price</label>
                      <p>${Number(selectedProduct.price || 0).toFixed(2)}</p>
                    </div>
                  </S.MetaCard>

                  <S.MetaCard>
                    <HiOutlineTag className="icon" />
                    <div>
                      <label>Category</label>
                      <p>{selectedProduct.category || 'N/A'}</p>
                    </div>
                  </S.MetaCard>

                  <S.MetaCard>
                    <HiOutlineCube className="icon" />
                    <div>
                      <label>Available Quantity</label>
                      <p>{selectedProduct.available_quantity ?? 0}</p>
                    </div>
                  </S.MetaCard>

                  <S.MetaCard>
                    <HiOutlineCube className="icon" />
                    <div>
                      <label>Minimum Quantity</label>
                      <p>{selectedProduct.minimum_quantity ?? 1}</p>
                    </div>
                  </S.MetaCard>
                </S.MetaGrid>

                {selectedProduct.product_id && (
                  <S.DetailRow>
                    <strong>Product ID:</strong> <span>{selectedProduct.product_id}</span>
                  </S.DetailRow>
                )}

                {/* ATTRIBUTE BADGES */}
                {Array.isArray(selectedProduct.product_type) && selectedProduct.product_type.length > 0 && (
                  <S.TagSection>
                    <label>Product Types:</label>
                    <S.BadgeGroup>
                      {selectedProduct.product_type.map((type, idx) => (
                        <S.Badge key={idx}>{type}</S.Badge>
                      ))}
                    </S.BadgeGroup>
                  </S.TagSection>
                )}

                {Array.isArray(selectedProduct.colors) && selectedProduct.colors.length > 0 && (
                  <S.TagSection>
                    <label>Colors:</label>
                    <S.BadgeGroup>
                      {selectedProduct.colors.map((color, idx) => (
                        <S.Badge key={idx} $colorBadge>
                          {color}
                        </S.Badge>
                      ))}
                    </S.BadgeGroup>
                  </S.TagSection>
                )}

                {Array.isArray(selectedProduct.sizes) && selectedProduct.sizes.length > 0 && (
                  <S.TagSection>
                    <label>Sizes:</label>
                    <S.BadgeGroup>
                      {selectedProduct.sizes.map((size, idx) => (
                        <S.Badge key={idx}>{size}</S.Badge>
                      ))}
                    </S.BadgeGroup>
                  </S.TagSection>
                )}

                {selectedProduct.video_url && (
                  <S.DetailRow>
                    <HiOutlineVideoCamera size={18} />
                    <a href={selectedProduct.video_url} target="_blank" rel="noopener noreferrer">
                      Watch Video Preview
                    </a>
                  </S.DetailRow>
                )}

                {/* DESCRIPTION */}
                <S.DescriptionBox>
                  <label>Description</label>
                  <p>{selectedProduct.description || 'No description provided.'}</p>
                </S.DescriptionBox>
              </S.DetailsSection>
            </S.ContentGrid>
          </div>
        ) : (
          <S.EmptyState>
            <HiOutlineCube size={48} />
            <p>Select a product from the list to view its details and options.</p>
          </S.EmptyState>
        )}
      </S.Main>

      {/* CONFIRM DELETE MODAL */}
      {showConfirmModal && (
        <S.ModalOverlay onClick={() => !isDeleting && setShowConfirmModal(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <HiOutlineExclamationCircle size={28} className="warning-icon" />
              <h3>Delete Product</h3>
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
                Are you sure you want to delete <strong>"{selectedProduct?.name}"</strong>?
              </p>
              <p className="subtext">
                This action will permanently remove the product record from MongoDB and delete all associated stored images from Supabase. This cannot be undone.
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
                  'Yes, Delete Product'
                )}
              </S.ModalButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};

export default DeleteProduct;