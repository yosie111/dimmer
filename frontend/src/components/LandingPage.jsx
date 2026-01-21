import React, { useState, useEffect, useRef } from 'react';

const LandingPage = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    source: 'website',
    productInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // UI State
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    setIsVisible(true);
    fetchProducts();
    
    // Scroll-triggered popup
    const handleScroll = () => {
      if (hasTriggeredRef.current || popupDismissed || isSubmitted) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      // הצג popup אחרי 40% גלילה
      if (scrollPercent > 40) {
        hasTriggeredRef.current = true;
        setShowPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [popupDismissed, isSubmitted]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=4');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productInterest: selectedProduct?.name || formData.productInterest
        })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '', source: 'website', productInterest: '' });
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
    setSelectedProduct(null);
  };

  const openPopupWithProduct = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
      50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
    }
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Background Effects */}
        <div style={styles.bgGradient}></div>
        <div style={styles.glowOrb1}></div>
        <div style={styles.glowOrb2}></div>

        {/* Hero Section - Compact */}
        <section style={{
          ...styles.hero,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
        }}>
          <div style={styles.badge}>
            <span style={styles.badgeDot}></span>
            <span>חדש! דגמי Mark 2 זמינים</span>
          </div>
          
          <h1 style={styles.headline}>
            שליטה מושלמת
            <span style={styles.headlineAccent}> בתאורת הבית</span>
          </h1>
          
          <p style={styles.subheadline}>
            מתגי דימר חכמים עם עמעום חלק והתקנה פשוטה
          </p>
        </section>

        {/* Main Product Showcase - 4 Products Grid */}
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
                      <span style={styles.priceBadge}>
                        ₪{products[activeImage].price}
                      </span>
                    </div>
                    <button 
                      style={styles.ctaButtonMain}
                      onClick={() => openPopupWithProduct(products[activeImage])}
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

        {/* Features Strip */}
        <section style={styles.featuresStrip}>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🎛️</span>
            <span style={styles.featureText}>שליטה מרחוק</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✨</span>
            <span style={styles.featureText}>עמעום חלק</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>⚡</span>
            <span style={styles.featureText}>התקנה פשוטה</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🛡️</span>
            <span style={styles.featureText}>3 שנות אחריות</span>
          </div>
        </section>

        {/* Stats Section */}
        <section style={styles.statsSection}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>5,000+</div>
            <div style={styles.statLabel}>לקוחות מרוצים</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>98%</div>
            <div style={styles.statLabel}>שביעות רצון</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>3 שנים</div>
            <div style={styles.statLabel}>אחריות</div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>מעוניינים לשמוע עוד?</h2>
          <p style={styles.ctaSubtitle}>השאירו פרטים ונחזור אליכם עם הצעת מחיר מותאמת</p>
          <button 
            style={styles.ctaButton}
            onClick={() => setShowPopup(true)}
          >
            צור קשר עכשיו
          </button>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© 2024 Dimmer. כל הזכויות שמורות.</p>
        </footer>

        {/* Scroll-Triggered Lead Form Popup */}
        {showPopup && (
          <div 
            style={styles.popupOverlay}
            onClick={(e) => e.target === e.currentTarget && closePopup()}
          >
            <div style={styles.popupContainer}>
              <button 
                style={styles.closeButton}
                onClick={closePopup}
              >
                ✕
              </button>

              {!isSubmitted ? (
                <>
                  <div style={styles.popupHeader}>
                    <h3 style={styles.popupTitle}>
                      {selectedProduct ? 'מעוניינים במוצר?' : 'קבלו הצעת מחיר'}
                    </h3>
                    <p style={styles.popupSubtitle}>
                      השאירו פרטים ונחזור אליכם בהקדם
                    </p>
                  </div>

                  {selectedProduct && (
                    <div style={styles.selectedProductBadge}>
                      <span>💡</span>
                      <span>{selectedProduct.name} - ₪{selectedProduct.price}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={styles.popupForm}>
                    <input
                      type="text"
                      name="name"
                      placeholder="שם מלא *"
                      value={formData.name}
                      onChange={handleChange}
                      style={styles.popupInput}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="טלפון *"
                      value={formData.phone}
                      onChange={handleChange}
                      style={styles.popupInput}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="אימייל *"
                      value={formData.email}
                      onChange={handleChange}
                      style={styles.popupInput}
                      required
                    />
                    <textarea
                      name="message"
                      placeholder="הודעה (אופציונלי)"
                      value={formData.message}
                      onChange={handleChange}
                      style={styles.popupTextarea}
                    />
                    <button 
                      type="submit" 
                      style={styles.popupSubmitButton}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'שולח...' : 'שלח פרטים'}
                    </button>
                  </form>

                  <p style={styles.privacyNote}>
                    🔒 הפרטים שלכם מאובטחים ולא יועברו לצד שלישי
                  </p>
                </>
              ) : (
                <div style={styles.successMessage}>
                  <div style={styles.successIcon}>✓</div>
                  <h3 style={styles.successTitle}>תודה רבה!</h3>
                  <p style={styles.successText}>
                    קיבלנו את הפרטים שלכם ונחזור אליכם בהקדם
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating CTA Button */}
        {!showPopup && (
          <button 
            style={styles.floatingCta}
            onClick={() => setShowPopup(true)}
          >
            💬 צור קשר
          </button>
        )}
      </div>
    </>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    fontFamily: "'Heebo', sans-serif",
    direction: 'rtl',
    position: 'relative',
    overflow: 'hidden'
  },
  bgGradient: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
    pointerEvents: 'none'
  },
  glowOrb1: {
    position: 'fixed',
    top: '10%',
    right: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
    animation: 'float 8s ease-in-out infinite'
  },
  glowOrb2: {
    position: 'fixed',
    bottom: '10%',
    left: '-10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
    animation: 'float 10s ease-in-out infinite reverse'
  },

  // Hero
  hero: {
    textAlign: 'center',
    padding: '60px 20px 40px',
    position: 'relative',
    zIndex: 10,
    transition: 'all 0.8s ease'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '50px',
    padding: '8px 20px',
    marginBottom: '24px',
    color: '#a5b4fc',
    fontSize: '14px',
    fontWeight: '500'
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    animation: 'pulse 2s infinite'
  },
  headline: {
    fontSize: 'clamp(32px, 6vw, 56px)',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '16px',
    lineHeight: '1.2'
  },
  headlineAccent: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subheadline: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '500px',
    margin: '0 auto'
  },

  // Main Showcase
  showcaseSection: {
    padding: '20px',
    position: 'relative',
    zIndex: 10
  },
  showcaseContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  mainImageArea: {
    width: '100%',
    aspectRatio: '16/9',
    maxHeight: '500px',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  mainImageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  mainImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)'
  },
  placeholderIcon: {
    fontSize: '80px',
    marginBottom: '10px'
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '24px',
    fontWeight: '600'
  },
  mainImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '30px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px'
  },
  mainProductName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    margin: 0
  },
  mainProductMeta: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  metaBadge: {
    background: 'rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  priceBadge: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700'
  },
  ctaButtonMain: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px'
  },

  // Thumbnails Grid
  thumbnailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px'
  },
  thumbnailCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    animation: 'fadeIn 0.5s ease forwards'
  },
  thumbnailActive: {
    borderColor: '#6366f1',
    background: 'rgba(99, 102, 241, 0.1)',
    transform: 'scale(1.02)'
  },
  thumbnailImageContainer: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
    fontSize: '32px',
    aspectRatio: '1',
    borderRadius: '10px'
  },
  thumbnailInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  thumbnailName: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1
  },
  thumbnailPrice: {
    color: '#10b981',
    fontSize: '14px',
    fontWeight: '700'
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '30px',
    height: '4px',
    background: '#6366f1',
    borderRadius: '2px'
  },

  // Features Strip
  featuresStrip: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    padding: '40px 20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'relative',
    zIndex: 10
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  featureIcon: {
    fontSize: '24px'
  },
  featureText: {
    fontSize: '15px',
    fontWeight: '500'
  },

  // Stats
  statsSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    padding: '50px 20px',
    position: 'relative',
    zIndex: 10
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '5px'
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px'
  },

  // CTA Section
  ctaSection: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(99, 102, 241, 0.05)',
    position: 'relative',
    zIndex: 10
  },
  ctaTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '10px'
  },
  ctaSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '25px',
    fontSize: '16px'
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 40px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
  },

  // Footer
  footer: {
    textAlign: 'center',
    padding: '30px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '14px',
    position: 'relative',
    zIndex: 10
  },

  // Floating CTA
  floatingCta: {
    position: 'fixed',
    bottom: '30px',
    left: '30px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
    zIndex: 100,
    animation: 'glow 2s infinite',
    transition: 'all 0.3s ease'
  },

  // Popup
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
    padding: '20px'
  },
  popupContainer: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '35px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  popupHeader: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  popupTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px'
  },
  popupSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)'
  },
  selectedProductBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '20px',
    color: '#a5b4fc',
    fontSize: '14px',
    fontWeight: '500'
  },
  popupForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  popupInput: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  },
  popupTextarea: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  popupSubmitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '5px'
  },
  privacyNote: {
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '15px'
  },
  successMessage: {
    textAlign: 'center',
    padding: '30px 0'
  },
  successIcon: {
    width: '70px',
    height: '70px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '32px',
    color: '#fff'
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '10px'
  },
  successText: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.6)'
  }
};

export default LandingPage;
