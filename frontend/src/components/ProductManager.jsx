import React, { useState, useEffect } from 'react';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState({ model: '', color: '', inStock: '' });

  const [formData, setFormData] = useState({
    name: '',
    model: 'mark1',
    positions: 1,
    color: 'white',
    price: '',
    features: '',
    inStock: true,
    image: null
  });

  // טעינת מוצרים
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.model) params.append('model', filter.model);
      if (filter.color) params.append('color', filter.color);
      if (filter.inStock) params.append('inStock', filter.inStock);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  // פתיחת מודל להוספה
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      model: 'mark1',
      positions: 1,
      color: 'white',
      price: '',
      features: '',
      inStock: true,
      image: null
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // פתיחת מודל לעריכה
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      model: product.model,
      positions: product.positions,
      color: product.color,
      price: product.price,
      features: product.features.join(', '),
      inStock: product.inStock,
      image: null
    });
    setImagePreview(product.imageUrl || null);
    setIsModalOpen(true);
  };

  // סגירת מודל
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImagePreview(null);
  };

  // טיפול בשינוי תמונה
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // שליחת טופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('model', formData.model);
      submitData.append('positions', formData.positions);
      submitData.append('color', formData.color);
      submitData.append('price', formData.price);
      submitData.append('features', formData.features);
      submitData.append('inStock', formData.inStock);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      
      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData
      });

      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
        closeModal();
        alert(editingProduct ? 'המוצר עודכן בהצלחה!' : 'המוצר נוסף בהצלחה!');
      } else {
        alert(data.message || 'אירעה שגיאה');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('אירעה שגיאה בשמירת המוצר');
    } finally {
      setUploading(false);
    }
  };

  // מחיקת מוצר
  const handleDelete = async (productId) => {
    if (!window.confirm('האם למחוק את המוצר?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
        alert('המוצר נמחק בהצלחה!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('אירעה שגיאה במחיקת המוצר');
    }
  };

  // מחיקת תמונה בלבד
  const handleDeleteImage = async (productId) => {
    if (!window.confirm('האם למחוק את התמונה?')) return;

    try {
      const response = await fetch(`/api/products/${productId}/image`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
        if (editingProduct && editingProduct._id === productId) {
          setImagePreview(null);
        }
        alert('התמונה נמחקה בהצלחה!');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const styles = {
    container: {
      direction: 'rtl',
      fontFamily: "'Heebo', sans-serif",
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a1a2e'
    },
    addButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    filters: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    filterSelect: {
      padding: '10px 15px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '14px',
      minWidth: '150px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      backgroundColor: '#f0f0f0'
    },
    noImage: {
      width: '100%',
      height: '200px',
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px'
    },
    productInfo: {
      padding: '15px'
    },
    productName: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#1a1a2e'
    },
    productDetails: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    productPrice: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#4CAF50',
      marginTop: '10px'
    },
    stockBadge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '8px'
    },
    inStock: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32'
    },
    outOfStock: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    cardActions: {
      display: 'flex',
      gap: '10px',
      padding: '15px',
      borderTop: '1px solid #eee'
    },
    editButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    },
    deleteButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
      direction: 'rtl'
    },
    modalHeader: {
      padding: '20px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1a1a2e'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666'
    },
    modalBody: {
      padding: '20px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '14px',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    },
    imageUpload: {
      border: '2px dashed #ddd',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.2s'
    },
    imagePreview: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: '8px',
      marginTop: '10px'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px'
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      color: '#666'
    },
    row: {
      display: 'flex',
      gap: '15px'
    },
    halfWidth: {
      flex: 1
    },
    deleteImageBtn: {
      backgroundColor: '#ff9800',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      marginTop: '10px'
    }
  };

  const colorLabels = { white: 'לבן', black: 'שחור', gray: 'אפור' };
  const modelLabels = { mark1: 'Mark 1', mark2: 'Mark 2' };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <div style={styles.header}>
        <h1 style={styles.title}>ניהול מוצרים</h1>
        <button style={styles.addButton} onClick={openAddModal}>
          + הוסף מוצר
        </button>
      </div>

      {/* פילטרים */}
      <div style={styles.filters}>
        <select 
          style={styles.filterSelect}
          value={filter.model}
          onChange={(e) => setFilter({ ...filter, model: e.target.value })}
        >
          <option value="">כל הדגמים</option>
          <option value="mark1">Mark 1</option>
          <option value="mark2">Mark 2</option>
        </select>

        <select 
          style={styles.filterSelect}
          value={filter.color}
          onChange={(e) => setFilter({ ...filter, color: e.target.value })}
        >
          <option value="">כל הצבעים</option>
          <option value="white">לבן</option>
          <option value="black">שחור</option>
          <option value="gray">אפור</option>
        </select>

        <select 
          style={styles.filterSelect}
          value={filter.inStock}
          onChange={(e) => setFilter({ ...filter, inStock: e.target.value })}
        >
          <option value="">כל המוצרים</option>
          <option value="true">במלאי</option>
          <option value="false">אזל מהמלאי</option>
        </select>
      </div>

      {/* רשימת מוצרים */}
      {loading ? (
        <div style={styles.loading}>טוען מוצרים...</div>
      ) : products.length === 0 ? (
        <div style={styles.emptyState}>
          <p>אין מוצרים להצגה</p>
          <button style={styles.addButton} onClick={openAddModal}>הוסף מוצר ראשון</button>
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {products.map((product) => (
            <div key={product._id} style={styles.productCard}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
              ) : (
                <div style={styles.noImage}>אין תמונה</div>
              )}
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productDetails}>דגם: {modelLabels[product.model]}</p>
                <p style={styles.productDetails}>צבע: {colorLabels[product.color]}</p>
                <p style={styles.productDetails}>מעגלים: {product.positions}</p>
                <p style={styles.productPrice}>₪{product.price}</p>
                <span style={{
                  ...styles.stockBadge,
                  ...(product.inStock ? styles.inStock : styles.outOfStock)
                }}>
                  {product.inStock ? 'במלאי' : 'אזל מהמלאי'}
                </span>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.editButton} onClick={() => openEditModal(product)}>
                  ערוך
                </button>
                <button style={styles.deleteButton} onClick={() => handleDelete(product._id)}>
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
              </h2>
              <button style={styles.closeButton} onClick={closeModal}>×</button>
            </div>
            <div style={styles.modalBody}>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>שם המוצר *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                    <label style={styles.label}>דגם *</label>
                    <select
                      style={styles.select}
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    >
                      <option value="mark1">Mark 1</option>
                      <option value="mark2">Mark 2</option>
                    </select>
                  </div>

                  <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                    <label style={styles.label}>מעגלים *</label>
                    <select
                      style={styles.select}
                      value={formData.positions}
                      onChange={(e) => setFormData({ ...formData, positions: parseInt(e.target.value) })}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                    <label style={styles.label}>צבע *</label>
                    <select
                      style={styles.select}
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    >
                      <option value="white">לבן</option>
                      <option value="black">שחור</option>
                      <option value="gray">אפור</option>
                    </select>
                  </div>

                  <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                    <label style={styles.label}>מחיר *</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>תכונות (מופרדות בפסיק)</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="שליטה מרחוק, עמעום חלק, התקנה קלה"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>תמונת המוצר</label>
                  <div style={styles.imageUpload}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="imageInput"
                    />
                    <label htmlFor="imageInput" style={{ cursor: 'pointer' }}>
                      {imagePreview ? (
                        <div>
                          <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                          <p style={{ marginTop: '10px', color: '#666' }}>לחץ להחלפת התמונה</p>
                        </div>
                      ) : (
                        <div>
                          <p>📷 לחץ לבחירת תמונה</p>
                          <p style={{ fontSize: '12px', color: '#999' }}>JPG, PNG, WebP עד 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {editingProduct && editingProduct.imageUrl && (
                    <button 
                      type="button"
                      style={styles.deleteImageBtn}
                      onClick={() => handleDeleteImage(editingProduct._id)}
                    >
                      🗑️ מחק תמונה נוכחית
                    </button>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    <span>במלאי</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  style={{
                    ...styles.submitButton,
                    ...(uploading ? styles.disabledButton : {})
                  }}
                  disabled={uploading}
                >
                  {uploading ? 'שומר...' : (editingProduct ? 'עדכן מוצר' : 'הוסף מוצר')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
