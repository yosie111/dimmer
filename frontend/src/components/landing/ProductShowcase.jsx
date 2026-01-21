import React from 'react';
import { styles } from './styles';

const ProductShowcase = ({ products, activeImage, setActiveImage, onProductClick }) => {
  return (
    <section style={styles.showcaseSection}>
      <div style={styles.showcaseContainer}>
        {/* Large Featured Image */}
        <div style={styles.mainImageArea}>
          {products.length > 0 && products[activeImage] ? (
            <div style={styles.mainImageWrapper}>
              {products[activeImage].imageUrl ? (
                <img 
                  src={products[activeImage].imageUrl} 
                  alt={products[activeImage].name}
                  style={styles.mainImage}
                />
              ) : (
                <div style={styles.mainImagePlaceholder}>
                  <span style={styles.placeholderIcon}>💡</span>
                </div>
              )}
              <div style={styles.mainImageOverlay}>
                <h2 style={styles.mainProductName}>{products[activeImage].name}</h2>
                <div style={styles.mainProductMeta}>
                  <span style={styles.metaBadge}>
                    {products[activeImage].model === 'mark1' ? 'Mark 1' : 'Mark 2'}
                  </span>
                  <span style={styles.metaBadge}>
                    {products[activeImage].positions} מעגלים
                  </span>
                  {products[activeImage].sku && (
                    <span style={styles.skuBadge}>
                      {products[activeImage].sku}
                    </span>
                  )}
                  <span style={styles.priceBadge}>
                    ₪{products[activeImage].price}
                  </span>
                </div>
                <button 
                  style={styles.ctaButtonMain}
                  onClick={() => onProductClick(products[activeImage])}
                >
                  קבל הצעת מחיר
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.mainImagePlaceholder}>
              <span style={styles.placeholderIcon}>💡</span>
              <p style={styles.placeholderText}>Dimmer Pro</p>
            </div>
          )}
        </div>

        {/* 4 Thumbnail Images */}
        <div style={styles.thumbnailsGrid}>
          {products.length > 0 ? products.map((product, index) => (
            <div 
              key={product._id}
              style={{
                ...styles.thumbnailCard,
                ...(activeImage === index ? styles.thumbnailActive : {}),
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => setActiveImage(index)}
              onMouseEnter={(e) => {
                if (activeImage !== index) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeImage !== index) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <div style={styles.thumbnailImageContainer}>
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    style={styles.thumbnailImage}
                  />
                ) : (
                  <div style={styles.thumbnailPlaceholder}>
                    <span>💡</span>
                  </div>
                )}
              </div>
              <div style={styles.thumbnailInfo}>
                <span style={styles.thumbnailName}>{product.name}</span>
                <span style={styles.thumbnailPrice}>₪{product.price}</span>
              </div>
              {product.sku && (
                <div style={styles.thumbnailSku}>{product.sku}</div>
              )}
              {activeImage === index && <div style={styles.activeIndicator}></div>}
            </div>
          )) : (
            // Placeholders
            [1, 2, 3, 4].map(i => (
              <div key={i} style={styles.thumbnailCard}>
                <div style={styles.thumbnailPlaceholder}>
                  <span>💡</span>
                </div>
                <div style={styles.thumbnailInfo}>
                  <span style={styles.thumbnailName}>Dimmer Pro {i}</span>
                  <span style={styles.thumbnailPrice}>₪{149 + (i * 50)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
