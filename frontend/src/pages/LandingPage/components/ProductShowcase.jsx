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

              <div style={styles.mainImageOverlay}>
                <h2 style={styles.mainProductName}>{activeProduct.name}</h2>

                <div style={styles.mainProductMeta}>
                  <span style={styles.metaBadge}>
                    {activeProduct.model === "mark1" ? "Mark 1" : "Mark 2"}
                  </span>
                  <span style={styles.metaBadge}>{activeProduct.positions} מעגלים</span>
                  <span style={styles.priceBadge}>₪{activeProduct.price}</span>
                </div>

                <button style={styles.ctaButtonMain} onClick={() => onGetQuote(activeProduct)}>
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
        <div style={styles.thumbnailsGrid}>
          {products?.length ? (
            products.map((product, index) => (
              <div
                key={product._id || index}
                style={{
                  ...styles.thumbnailCard,
                  ...(activeImage === index ? styles.thumbnailActive : {}),
                  animationDelay: `${index * 0.1}s`,
                }}
                onClick={() => setActiveImage(index)}
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

                {activeImage === index && <div style={styles.activeIndicator}></div>}
              </div>
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} style={styles.thumbnailCard}>
                <div style={styles.thumbnailPlaceholder}>
                  <span>💡</span>
                </div>
                <div style={styles.thumbnailInfo}>
                  <span style={styles.thumbnailName}>Dimmer Pro {i}</span>
                  <span style={styles.thumbnailPrice}>₪{149 + i * 50}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
