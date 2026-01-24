export const keyframesCss = `
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); } 50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); } }

  @media (max-width: 768px) {
    .thumbnails-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
    }
    
    .thumbnail-card {
      padding: 8px !important;
    }
    
    .thumbnail-image-container {
      aspect-ratio: 1 !important;
      margin-bottom: 6px !important;
    }
    
    .thumbnail-name {
      font-size: 11px !important;
    }
    
    .thumbnail-price {
      font-size: 12px !important;
    }
    
    .main-image-overlay {
      padding: 15px !important;
    }
    
    .main-product-name {
      font-size: 20px !important;
    }
    
    .floating-cta {
      bottom: 20px !important;
      left: 20px !important;
      padding: 12px 20px !important;
      font-size: 14px !important;
    }
    
    .hero-section {
      padding: 30px 15px 20px !important;
    }
    
    .popup-container {
      padding: 25px !important;
      margin: 10px !important;
    }
    
    .meta-badge, .price-badge {
      padding: 4px 10px !important;
      font-size: 12px !important;
    }
    
    .cta-button-main {
      padding: 10px 20px !important;
      font-size: 14px !important;
    }
  }
`;

export const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
    fontFamily: "'Heebo', sans-serif",
    direction: "rtl",
    position: "relative",
    overflow: "hidden",
    gap: '40px' 
  },
  bgGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  glowOrb1: {
    position: "fixed",
    top: "10%",
    right: "-10%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
    animation: "float 8s ease-in-out infinite",
  },
  glowOrb2: {
    position: "fixed",
    bottom: "10%",
    left: "-10%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
    animation: "float 10s ease-in-out infinite reverse",
  },

  // Hero
  hero: {
    textAlign: "center",
    padding: "60px 20px 40px",
    position: "relative",
    zIndex: 10,
    transition: "all 0.8s ease",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(99, 102, 241, 0.15)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    borderRadius: "50px",
    padding: "8px 20px",
    marginBottom: "24px",
    color: "#a5b4fc",
    fontSize: "14px",
    fontWeight: "500",
  },
  badgeDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10b981",
    animation: "pulse 2s infinite",
  },
  headline: {
    fontSize: "clamp(32px, 6vw, 56px)",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "16px",
    lineHeight: "1.2",
  },
  headlineAccent: {
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subheadline: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.6)",
    maxWidth: "500px",
    margin: "0 auto",
  },

  // Showcase
  showcaseSection: { padding: "20px", position: "relative", zIndex: 10 },
  showcaseContainer: { maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" },
  mainImageArea: {
    width: "100%",
    aspectRatio: "16/9",
    maxHeight: "500px",
    borderRadius: "24px",
    overflow: "hidden",
    position: "relative",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  mainImageWrapper: { width: "100%", height: "100%", position: "relative" },
  mainImage: { width: "100%", height: "100%", objectFit: "cover" },
  mainImagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)",
  },
  placeholderIcon: { fontSize: "80px", marginBottom: "10px" },
  placeholderText: { color: "rgba(255, 255, 255, 0.5)", fontSize: "24px", fontWeight: "600" },
  mainImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "30px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
  },
  mainProductName: { fontSize: "28px", fontWeight: "700", color: "#fff", margin: 0 },
  mainProductMeta: { display: "flex", gap: "10px", flexWrap: "wrap" },
  metaBadge: { background: "rgba(99, 102, 241, 0.3)", color: "#a5b4fc", padding: "6px 14px", borderRadius: "8px", fontSize: "14px", fontWeight: "500" },
  priceBadge: { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#fff", padding: "6px 14px", borderRadius: "8px", fontSize: "16px", fontWeight: "700" },
  ctaButtonMain: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
  },

  thumbnailsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" },
  thumbnailCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    animation: "fadeIn 0.5s ease forwards",
  },
  thumbnailActive: { borderColor: "#6366f1", background: "rgba(99, 102, 241, 0.1)", transform: "scale(1.02)" },
  thumbnailImageContainer: { width: "100%", aspectRatio: "1", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" },
  thumbnailImage: { width: "100%", height: "100%", objectFit: "cover" },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)",
    fontSize: "32px",
    aspectRatio: "1",
    borderRadius: "10px",
  },
  thumbnailInfo: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  thumbnailName: { color: "#fff", fontSize: "13px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
  thumbnailPrice: { color: "#10b981", fontSize: "14px", fontWeight: "700" },
  activeIndicator: { position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", width: "30px", height: "4px", background: "#6366f1", borderRadius: "2px" },

  // Floating CTA
  floatingCta: {
    position: "fixed",
    bottom: "30px",
    left: "30px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
    zIndex: 100,
    animation: "glow 2s infinite",
    transition: "all 0.3s ease",
  },

  // Popup
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease",
    padding: "20px",
  },
  popupContainer: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "35px",
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  popupHeader: { textAlign: "center", marginBottom: "20px" },
  popupTitle: { fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  popupSubtitle: { fontSize: "14px", color: "rgba(255, 255, 255, 0.5)" },
  selectedProductBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    background: "rgba(99, 102, 241, 0.2)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "20px",
    color: "#a5b4fc",
    fontSize: "14px",
    fontWeight: "500",
  },
  popupForm: { display: "flex", flexDirection: "column", gap: "12px" },
  popupInput: {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  popupTextarea: {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    minHeight: "80px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  popupSubmitButton: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "5px",
  },
  privacyNote: { textAlign: "center", fontSize: "12px", color: "rgba(255, 255, 255, 0.4)", marginTop: "15px" },
  successMessage: { textAlign: "center", padding: "30px 0" },
  successIcon: {
    width: "70px",
    height: "70px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "32px",
    color: "#fff",
  },
  successTitle: { fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "10px" },
  successText: { fontSize: "15px", color: "rgba(255, 255, 255, 0.6)" },

  // Footer
  footer: {
    textAlign: "center",
    padding: "40px 20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "60px",
    position: "relative",
    zIndex: 10,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "14px",
    margin: 0,
  },
};