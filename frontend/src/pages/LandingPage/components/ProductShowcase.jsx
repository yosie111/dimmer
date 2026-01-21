import React from "react";
import { styles } from "../styles";

export function ProductShowcase({
  products,
  activeImage,
  setActiveImage,
  activeProduct,
  onGetQuote,
}) {
  return (
    <section style={styles.showcaseSection}>
      <div style={styles.showcaseContainer}>

        {/* Featured image */}
        <div style={styles.mainImageArea}>
          {activeProduct ? (
            <div style={styles.mainImageWrapper}>
              {activeProduct.imageUrl ? (
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  style={styles.mainImage}
                />
              ) : (
                <div style={styles.mainImagePlaceholder}>
                  <span style={styles.placeholderIcon}>💡</span>
                </div>
              )}

              <div className="main-image-overlay" style={styles.mainImageOverlay}>
                <h2 className="main-product-name" style={styles.mainProductName}>
                  {activeProduct.name}
                </h2>

                <div style={styles.mainProductMeta}>
                  <span className="meta-badge" style={styles.metaBadge}>
                    {activeProduct.model === "mark1" ? "Mark 1" : "Mark 2"}
                  </span>

                  <span className="meta-badge" style={styles.metaBadge}>
                    {activeProduct.positions} מעגלים
                  </span>

                  <span className="price-badge" style={styles.priceBadge}>
                    ₪{activeProduct.price}
                  </span>
                </div>

                <button
                  className="cta-button-main"
                  style={styles.ctaButtonMain}
                  onClick={() => onGetQuote(activeProduct)}
                  type="button"
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

        {/* Thumbnails */}
        <div className="thumbnails-grid" style={styles.thumbnailsGrid}>
          {products?.length ? (
            products.map((product, index) => (
              <div
                key={product._id || index}
                className="thumbnail-card"
                style={{
                  ...styles.thumbnailCard,
                  ...(activeImage === index ? styles.thumbnailActive : {}),
                  animationDelay: `${index * 0.1}s`,
                }}
                onClick={() => setActiveImage(index)}
              >
                <div className="thumbnail-image-container" style={styles.thumbnailImageContainer}>
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
                  <span className="thumbnail-name" style={styles.thumbnailName}>{product.name}</span>
                  <span className="thumbnail-price" style={styles.thumbnailPrice}>₪{product.price}</span>
                </div>

                {activeImage === index && (
                  <div style={styles.activeIndicator} />
                )}
              </div>
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="thumbnail-card" style={styles.thumbnailCard}>
                <div style={styles.thumbnailPlaceholder}>
                  <span>💡</span>
                </div>
                <div style={styles.thumbnailInfo}>
                  <span className="thumbnail-name" style={styles.thumbnailName}>Dimmer Pro {i}</span>
                  <span className="thumbnail-price" style={styles.thumbnailPrice}>₪{149 + i * 50}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
