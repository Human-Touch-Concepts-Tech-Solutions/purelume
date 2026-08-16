'use client';

import { useState, useEffect } from 'react';
import { publishSingleProductAction } from '@/lib/actions';
import { 
  HiOutlineCloudUpload, 
  HiX, 
  HiOutlineTrash,
  HiPencilAlt,
  HiOutlineHashtag,
  HiRefresh
} from 'react-icons/hi';

import * as S from './ProductFormStyles';

const generateProductId = () => {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PROD-${dateStr}-${randomSuffix}`;
};

const ProductForm = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    description: '',
    price: '',
    category: 'Necklaces',
    available_quantity: 0,
    minimum_quantity: 1,
    video_url: '',
    colors: [],
    sizes: [],
    product_type: []
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [tagInputs, setTagInputs] = useState({ colors: '', sizes: '', product_type: '' });
  
  const [queue, setQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

  // Generate initial Product ID on load
  useEffect(() => {
    setFormData((prev) => ({ ...prev, product_id: generateProductId() }));
  }, []);

  // 1. PERSISTENCE: Load queue from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('purelume_batch_queue');
    if (saved) {
      try {
        setQueue(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load queue", e);
      }
    }
  }, []);

  // 2. PERSISTENCE: Save queue changes
  useEffect(() => {
    localStorage.setItem('purelume_batch_queue', JSON.stringify(queue));
  }, [queue]);

  // Image compression utility
  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (typeof file === 'string') return resolve(file);
      
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
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      alert("Maximum 4 images allowed per product.");
      return;
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    if (previews[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previews[index]);
    }
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleAddTag = (e, field) => {
    if (e.key === 'Enter' && tagInputs[field].trim()) {
      e.preventDefault();
      const val = tagInputs[field].trim();
      if (!formData[field].includes(val)) {
        setFormData({ ...formData, [field]: [...formData[field], val] });
      }
      setTagInputs({ ...tagInputs, [field]: '' });
    }
  };

  const removeTag = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const regenerateId = () => {
    setFormData((prev) => ({ ...prev, product_id: generateProductId() }));
  };

  // Add Item to Queue with formatted values
  const addToQueue = async () => {
    if (!formData.name.trim() || !formData.price) {
      return alert("Please enter Product Name and Price.");
    }
    if (queue.length >= 25) {
      return alert("Batch limit (25) reached.");
    }

    const compressedImages = await Promise.all(
      images.map(img => compressImage(img))
    );

    const formattedProduct = {
      ...formData,
      id: Date.now(),
      product_id: formData.product_id || generateProductId(),
      price: parseFloat(formData.price) || 0,
      available_quantity: parseInt(formData.available_quantity, 10) || 0,
      minimum_quantity: parseInt(formData.minimum_quantity, 10) || 1,
      video_url: formData.video_url.trim(),
      colors: Array.isArray(formData.colors) ? formData.colors : [],
      sizes: Array.isArray(formData.sizes) ? formData.sizes : [],
      product_type: Array.isArray(formData.product_type) ? formData.product_type : [],
      image_data: compressedImages
    };

    setQueue([...queue, formattedProduct]);

    // Reset Form
    setFormData({
      product_id: generateProductId(),
      name: '',
      description: '',
      price: '',
      category: 'Necklaces',
      available_quantity: 0,
      minimum_quantity: 1,
      video_url: '',
      colors: [],
      sizes: [],
      product_type: []
    });
    setImages([]);
    setPreviews([]);
  };

  const editQueueItem = (id) => {
    const itemToEdit = queue.find(item => item.id === id);
    if (!itemToEdit) return;

    setFormData({
      product_id: itemToEdit.product_id || generateProductId(),
      name: itemToEdit.name || '',
      description: itemToEdit.description || '',
      price: itemToEdit.price || '',
      category: itemToEdit.category || 'Necklaces',
      available_quantity: itemToEdit.available_quantity ?? 0,
      minimum_quantity: itemToEdit.minimum_quantity ?? 1,
      video_url: itemToEdit.video_url || '',
      colors: itemToEdit.colors || [],
      sizes: itemToEdit.sizes || [],
      product_type: itemToEdit.product_type || []
    });

    setImages(itemToEdit.image_data || []); 
    setPreviews(itemToEdit.image_data || []);
    setQueue(queue.filter(item => item.id !== id));
  };

  const deleteQueueItem = (id) => {
    setQueue(queue.filter(item => item.id !== id));
  };

  // Publish process: Sequential item processing with Supabase upload & MongoDB insertion
  const handlePublishAll = async (e) => {
    e.preventDefault();
    if (queue.length === 0) return;

    const totalItems = queue.length;
    setIsSyncing(true);
    setSyncProgress({ current: totalItems, total: totalItems });

    let remainingQueue = [...queue];

    for (let i = 0; i < totalItems; i++) {
      const product = queue[i];

      try {
        const response = await publishSingleProductAction(product);

        if (!response.success) {
          alert(`Failed to publish "${product.name}": ${response.error}`);
          setIsSyncing(false);
          return;
        }

        remainingQueue = remainingQueue.filter(item => item.id !== product.id);
        setQueue(remainingQueue);
        setSyncProgress({ current: totalItems - (i + 1), total: totalItems });

      } catch (err) {
        console.error("Upload error:", err);
        alert(`An error occurred while uploading "${product.name}".`);
        setIsSyncing(false);
        return;
      }
    }

    setIsSyncing(false);
    localStorage.removeItem('purelume_batch_queue');
    alert(`Success! All ${totalItems} products were published.`);
  };

  return (
    <S.FormContainer onSubmit={handlePublishAll}>
      {/* Sync Overlay / Progress Indicator */}
      {isSyncing && (
        <S.ProgressModal>
          <S.ProgressBox>
            <S.Spinner />
            <h4>Publishing Products...</h4>
            <p>
              <strong>{syncProgress.current}</strong> of {syncProgress.total} products remaining
            </p>
            <S.ProgressBar>
              <S.ProgressFill 
                $percent={((syncProgress.total - syncProgress.current) / syncProgress.total) * 100} 
              />
            </S.ProgressBar>
          </S.ProgressBox>
        </S.ProgressModal>
      )}

      {/* Main Content Area */}
      <div>
        <S.Section>
          <h3>General Information</h3>
          <S.FormGroup>
            <label>Product ID (Auto-generated)</label>
            <S.InputWithAction>
              <input type="text" value={formData.product_id} readOnly />
              <button type="button" onClick={regenerateId} title="Regenerate ID">
                <HiRefresh />
              </button>
            </S.InputWithAction>
          </S.FormGroup>

          <S.FormGroup>
            <label>Product Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Celestial Diamond Pendant"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </S.FormGroup>

          <S.FormGroup>
            <label>Description</label>
            <textarea 
              placeholder="Enter product description..."
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </S.FormGroup>
        </S.Section>

        <S.Section>
          <h3>Product Media</h3>
          <S.UploadGrid>
            {previews.map((src, i) => (
              <S.PreviewCard key={i}>
                <img src={src} alt={`Preview ${i + 1}`} />
                <button type="button" onClick={() => removeImage(i)}>
                  <HiX />
                </button>
              </S.PreviewCard>
            ))}
            {images.length < 4 && (
              <S.UploadBox>
                <HiOutlineCloudUpload />
                <span>Add Image ({images.length}/4)</span>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} />
              </S.UploadBox>
            )}
          </S.UploadGrid>

          <S.FormGroup style={{ marginTop: '1.5rem' }}>
            <label>Video URL (Optional)</label>
            <input 
              type="text" 
              placeholder="https://youtube.com/..."
              value={formData.video_url} 
              onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
            />
          </S.FormGroup>
        </S.Section>

        <S.Section>
          <h3>Attributes & Variants</h3>
          <S.FormGroup>
            <label>Colors</label>
            <S.TagInputContainer>
              {formData.colors.map((tag, i) => (
                <div key={i} className="tag">
                  {tag} 
                  <button type="button" onClick={() => removeTag('colors', i)}><HiX /></button>
                </div>
              ))}
              <input 
                type="text" 
                placeholder="Press Enter to add color"
                value={tagInputs.colors} 
                onChange={(e) => setTagInputs({...tagInputs, colors: e.target.value})} 
                onKeyDown={(e) => handleAddTag(e, 'colors')} 
              />
            </S.TagInputContainer>
          </S.FormGroup>

          <S.FormGroup>
            <label>Sizes</label>
            <S.TagInputContainer>
              {formData.sizes.map((tag, i) => (
                <div key={i} className="tag">
                  {tag} 
                  <button type="button" onClick={() => removeTag('sizes', i)}><HiX /></button>
                </div>
              ))}
              <input 
                type="text" 
                placeholder="Press Enter to add size"
                value={tagInputs.sizes} 
                onChange={(e) => setTagInputs({...tagInputs, sizes: e.target.value})} 
                onKeyDown={(e) => handleAddTag(e, 'sizes')} 
              />
            </S.TagInputContainer>
          </S.FormGroup>
              {/* COMMENTED OUT FOR NOW: Product Types / Tags */}
          {/* <S.FormGroup>
            <label>Product Types / Tags</label>
            <S.TagInputContainer>
              {formData.product_type.map((tag, i) => (
                <div key={i} className="tag">
                  {tag} 
                  <button type="button" onClick={() => removeTag('product_type', i)}><HiX /></button>
                </div>
              ))}
              <input 
                type="text" 
                placeholder="Press Enter to add type"
                value={tagInputs.product_type} 
                onChange={(e) => setTagInputs({...tagInputs, product_type: e.target.value})} 
                onKeyDown={(e) => handleAddTag(e, 'product_type')} 
              />
            </S.TagInputContainer>
          </S.FormGroup> */}
        </S.Section>
      </div>

      {/* Sidebar Controls */}
      <div>
        <S.Section>
          <h3>Inventory & Pricing</h3>
          <S.FormGroup>
            <label>Price ($) *</label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="0.00"
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
            />
          </S.FormGroup>

          <S.GridTwoCols>
            <S.FormGroup>
              <label>Stock Quantity</label>
              <input 
                type="number" 
                min="0"
                value={formData.available_quantity} 
                onChange={(e) => setFormData({...formData, available_quantity: e.target.value})} 
              />
            </S.FormGroup>

            <S.FormGroup>
              <label>Min Quantity</label>
              <input 
                type="number" 
                min="1"
                value={formData.minimum_quantity} 
                onChange={(e) => setFormData({...formData, minimum_quantity: e.target.value})} 
              />
            </S.FormGroup>
          </S.GridTwoCols>

          <S.FormGroup>
            <label>Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Necklaces">Necklaces</option>
              <option value="Rings">Rings</option>
              <option value="Earrings">Earrings</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Pendants">Pendants</option>
            </select>
          </S.FormGroup>
        </S.Section>

        <S.SecondaryButton type="button" onClick={addToQueue}>
          Add to Batch Queue
        </S.SecondaryButton>

        <S.SubmitButton type="submit" disabled={queue.length === 0 || isSyncing}>
          {isSyncing ? "Publishing..." : `Publish All (${queue.length})`}
        </S.SubmitButton>

        {queue.length > 0 && (
          <S.Section style={{ marginTop: '2rem' }}>
            <S.QueueHeader>
              <h3>Pending Items</h3>
              <S.CountBadge>{queue.length}</S.CountBadge>
            </S.QueueHeader>
            
            <S.QueueList>
              {queue.map((item) => (
                <S.QueueItem key={item.id}>
                  <div className="info">
                    <span className="title">{item.name}</span>
                    <small>ID: {item.product_id}</small>
                    <small>${item.price} • Stock: {item.available_quantity} (Min: {item.minimum_quantity})</small>
                  </div>
                  <div className="actions">
                    <button 
                      type="button" 
                      className="edit" 
                      onClick={() => editQueueItem(item.id)} 
                      title="Edit Item"
                    >
                      <HiPencilAlt />
                    </button>
                    <button 
                      type="button" 
                      className="delete" 
                      onClick={() => deleteQueueItem(item.id)} 
                      title="Delete Item"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </S.QueueItem>
              ))}
            </S.QueueList>
          </S.Section>
        )}
      </div>
    </S.FormContainer>
  );
};

export default ProductForm;