'use client';

import { useState, useEffect } from 'react';
import { 
  HiOutlineSave, 
  HiX, 
  HiOutlineCloudUpload, 
  HiPencilAlt, 
  HiCheckCircle,
  HiOutlineChevronLeft,
  HiOutlineRefresh
} from 'react-icons/hi';
import * as S from './EditProductStyles';
import { getAllProductsAction, updateProductBatchAction } from '@/lib/actions';

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [modifiedIds, setModifiedIds] = useState(new Set());
  const [mobileShowForm, setMobileShowForm] = useState(false);

  // Tag inputs state for colors, sizes, and product_type
  const [tagInput, setTagInput] = useState({
    colors: '',
    sizes: '',
    product_type: ''
  });

  const fetchProducts = async () => {
    setIsSyncing(true);
    const data = await getAllProductsAction();
    setProducts(data);
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

 const selectProductToEdit = (product) => {
  setSelectedProduct({
    ...product,
    name: product.name || '',
    category: product.category || 'Necklaces',
    price: product.price ?? '',
    available_quantity: product.available_quantity ?? '',
    minimum_quantity: product.minimum_quantity ?? '',
    video_url: product.video_url || '',
    description: product.description || '',
    colors: product.colors || [],
    sizes: product.sizes || [],
    product_type: product.product_type || [],
    images: product.images || []
  });
  setMobileShowForm(true);
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct(prev => ({ ...prev, [name]: value }));
  };

  // --- Multi-Tag Management (colors, sizes, product_type) ---
  const addTag = (e, field) => {
    if (e.key === 'Enter' && tagInput[field].trim()) {
      e.preventDefault();
      const val = tagInput[field].trim();
      const currentList = selectedProduct[field] || [];

      if (!currentList.includes(val)) {
        setSelectedProduct(prev => ({
          ...prev,
          [field]: [...currentList, val]
        }));
      }
      setTagInput(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeTag = (field, index) => {
    const updated = (selectedProduct[field] || []).filter((_, i) => i !== index);
    setSelectedProduct(prev => ({ ...prev, [field]: updated }));
  };

  // --- Image Upload & Compression ---
  const compressAndReadImage = (file) => {
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
          const MAX_WIDTH = 1200;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingSlots = 4 - (selectedProduct.images?.length || 0);
    const filesToProcess = files.slice(0, remainingSlots);

    const base64Images = await Promise.all(
      filesToProcess.map(file => compressAndReadImage(file))
    );

    setSelectedProduct(prev => ({
      ...prev,
      images: [...(prev.images || []), ...base64Images]
    }));
  };

  const removeImage = (index) => {
    const updated = selectedProduct.images.filter((_, i) => i !== index);
    setSelectedProduct(prev => ({ ...prev, images: updated }));
  };

  // --- Save Changes Locally ---
  const saveLocally = () => {
    if (!selectedProduct) return;

    setProducts(prev => prev.map(p => p._id === selectedProduct._id ? selectedProduct : p));
    setModifiedIds(prev => new Set(prev).add(selectedProduct._id));
    setSelectedProduct(null);
    setMobileShowForm(false);
  };

  // --- Publish Batch Updates to MongoDB & Supabase ---
  const publishChanges = async () => {
    if (modifiedIds.size === 0) return;

    setIsSyncing(true);
    const changesToPush = products.filter(p => modifiedIds.has(p._id));

    try {
      const result = await updateProductBatchAction(changesToPush);
      if (result.success) {
        setModifiedIds(new Set());
        alert("Changes published successfully!");
        await fetchProducts();
      } else {
        alert(`Failed to publish: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while publishing.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <S.EditContainer>
      {/* Sidebar - Product List */}
      <S.Sidebar $hideOnMobile={mobileShowForm}>
        <S.Header>
          <div>
            <h3>Inventory ({products.length})</h3>
            {modifiedIds.size > 0 && <S.UnsavedBadge>{modifiedIds.size} Pending</S.UnsavedBadge>}
          </div>
          <S.HeaderActions>
            <button className="refresh-btn" onClick={fetchProducts} disabled={isSyncing} title="Refresh Inventory">
              <HiOutlineRefresh className={isSyncing ? 'spinning' : ''} />
            </button>
            <button className="publish-btn" onClick={publishChanges} disabled={modifiedIds.size === 0 || isSyncing}>
              {isSyncing ? 'Publishing...' : `Publish (${modifiedIds.size})`}
            </button>
          </S.HeaderActions>
        </S.Header>

        <S.ProductList>
          {products.map(p => (
            <S.ProductItem 
              key={p._id} 
              $active={selectedProduct?._id === p._id} 
              $isModified={modifiedIds.has(p._id)}
              onClick={() => selectProductToEdit(p)}
            >
              <img src={p.images?.[0] || '/placeholder.jpg'} alt={p.name} />
              <div>
                <p>{p.name}</p>
                <span>${p.price} • Stock: {p.available_quantity}</span>
              </div>
              {modifiedIds.has(p._id) && <HiCheckCircle className="status-icon" />}
            </S.ProductItem>
          ))}
        </S.ProductList>
      </S.Sidebar>

      {/* Main Form - Product Editor */}
      <S.MainForm $showOnMobile={mobileShowForm}>
        {selectedProduct ? (
          <S.FormContent>
            <S.MobileBackBar>
              <button onClick={() => setMobileShowForm(false)}>
                <HiOutlineChevronLeft /> Back to Inventory
              </button>
            </S.MobileBackBar>

            <S.FormHeader>
              <h2>Edit Product: {selectedProduct.name}</h2>
              <span className="product-id">{selectedProduct.product_id}</span>
            </S.FormHeader>

            <div className="grid">
  <div className="input-group">
    <label>Product Name *</label>
    <input 
      name="name" 
      value={selectedProduct.name || ''} 
      onChange={handleInputChange} 
      required 
    />
  </div>

  <div className="input-group">
    <label>Category</label>
    <select 
      name="category" 
      value={selectedProduct.category || 'Necklaces'} 
      onChange={handleInputChange}
    >
      <option value="Necklaces">Necklaces</option>
      <option value="Rings">Rings</option>
      <option value="Bracelets">Bracelets</option>
      <option value="Earrings">Earrings</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div className="input-group">
    <label>Price ($) *</label>
    <input 
      name="price" 
      type="number" 
      step="0.01" 
      value={selectedProduct.price ?? ''} 
      onChange={handleInputChange} 
      required 
    />
  </div>

  <div className="input-group">
    <label>Available Quantity</label>
    <input 
      name="available_quantity" 
      type="number" 
      value={selectedProduct.available_quantity ?? ''} 
      onChange={handleInputChange} 
    />
  </div>

  <div className="input-group">
    <label>Minimum Stock Threshold</label>
    <input 
      name="minimum_quantity" 
      type="number" 
      value={selectedProduct.minimum_quantity ?? ''} 
      onChange={handleInputChange} 
    />
  </div>

  <div className="input-group">
    <label>Video URL (Optional)</label>
    <input 
      name="video_url" 
      type="url" 
      placeholder="https://..." 
      value={selectedProduct.video_url || ''} 
      onChange={handleInputChange} 
    />
  </div>
</div>

<div className="input-group full-width">
  <label>Description</label>
  <textarea 
    name="description" 
    value={selectedProduct.description || ''} 
    onChange={handleInputChange} 
    rows={4} 
  />
</div>

            {/* Tags Section */}
            <S.TagSection>
              <div className="tag-group">
                <label>Colors (Press Enter)</label>
                <div className="tag-container">
                  {(selectedProduct.colors || []).map((c, i) => (
                    <span key={i}>{c} <HiX onClick={() => removeTag('colors', i)} /></span>
                  ))}
                  <input 
                    placeholder="Add color..." 
                    value={tagInput.colors} 
                    onChange={e => setTagInput({...tagInput, colors: e.target.value})} 
                    onKeyDown={e => addTag(e, 'colors')} 
                  />
                </div>
              </div>

              <div className="tag-group">
                <label>Sizes (Press Enter)</label>
                <div className="tag-container">
                  {(selectedProduct.sizes || []).map((s, i) => (
                    <span key={i}>{s} <HiX onClick={() => removeTag('sizes', i)} /></span>
                  ))}
                  <input 
                    placeholder="Add size..." 
                    value={tagInput.sizes} 
                    onChange={e => setTagInput({...tagInput, sizes: e.target.value})} 
                    onKeyDown={e => addTag(e, 'sizes')} 
                  />
                </div>
              </div>

              <div className="tag-group">
                <label>Product Type / Styles (Press Enter)</label>
                <div className="tag-container">
                  {(selectedProduct.product_type || []).map((t, i) => (
                    <span key={i}>{t} <HiX onClick={() => removeTag('product_type', i)} /></span>
                  ))}
                  <input 
                    placeholder="Add style..." 
                    value={tagInput.product_type} 
                    onChange={e => setTagInput({...tagInput, product_type: e.target.value})} 
                    onKeyDown={e => addTag(e, 'product_type')} 
                  />
                </div>
              </div>
            </S.TagSection>

            {/* Images Grid Section */}
            <S.ImageEditSection>
              <label>Product Images ({(selectedProduct.images || []).length}/4)</label>
              <div className="image-grid">
                {(selectedProduct.images || []).map((url, i) => (
                  <div key={i} className="img-card">
                    <img src={url} alt={`Product ${i + 1}`} />
                    <button type="button" onClick={() => removeImage(i)}><HiX /></button>
                  </div>
                ))}
                {(selectedProduct.images || []).length < 4 && (
                  <label className="upload-btn">
                    <HiOutlineCloudUpload />
                    <span>Upload</span>
                    <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </S.ImageEditSection>

            <S.ActionRow>
              <button className="cancel" onClick={() => { setSelectedProduct(null); setMobileShowForm(false); }}>Discard</button>
              <button className="save" onClick={saveLocally}><HiOutlineSave /> Save Locally</button>
            </S.ActionRow>
          </S.FormContent>
        ) : (
          <S.EmptyState>
            <HiPencilAlt size={48} />
            <p>Select a product from the list to edit its details.</p>
          </S.EmptyState>
        )}
      </S.MainForm>
    </S.EditContainer>
  );
};

export default EditProduct;