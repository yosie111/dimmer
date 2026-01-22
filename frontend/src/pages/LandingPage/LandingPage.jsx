import React, { useEffect, useState } from "react";
import { styles, keyframesCss } from "./styles";
import { useProducts } from "./hooks/useProducts";
import { useScrollPopup } from "./hooks/useScrollPopup";
import { useLeadForm } from "./hooks/useLeadForm";

import { Hero } from "./components/Hero";
import { ProductShowcase } from "./components/ProductShowcase";
import { LeadPopup } from "./components/LeadPopup";
import { FloatingCta } from "./components/FloatingCta";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products, activeImage, setActiveImage, activeProduct } = useProducts({ limit: 4 });

  const { showPopup, setShowPopup, closePopup, openPopup } = useScrollPopup({
    disabled: false,
    thresholdPercent: 40,
  });

  const { formData, errors, isSubmitting, isSubmitted, handleChange, submitLead, clearSubmitted } =
    useLeadForm();

  useEffect(() => setIsVisible(true), []);

  const handleClosePopup = () => {
    closePopup();
    setSelectedProduct(null);
    if (isSubmitted) clearSubmitted();
  };

  const openPopupWithProduct = (product) => {
    setSelectedProduct(product);
    openPopup();
  };

  // --- התיקון נמצא כאן ---
  const handleFormSubmit = async () => {
    const ok = await submitLead({ selectedProduct });

    if (ok) {
      setTimeout(() => {
        // 2. שימוש בפונקציית הסגירה הקיימת כדי לנקות הכל מסודר
        handleClosePopup(); 
      }, 3000);
    }
  };
  // -----------------------

  return (
    <>
      <style>{keyframesCss}</style>

      <div style={styles.container}>
        {/* Background Effects */}
        <div style={styles.bgGradient}></div>
        <div style={styles.glowOrb1}></div>
        <div style={styles.glowOrb2}></div>

        {/* Hero */}
        <Hero isVisible={isVisible} />

        {/* Product Showcase */}
        <ProductShowcase
          products={products}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          activeProduct={activeProduct}
          onGetQuote={openPopupWithProduct}
        />

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>© {new Date().getFullYear()} Dimmer. כל הזכויות שמורות.</p>
        </footer>

        {/* Lead Form Popup */}
        <LeadPopup
          show={showPopup}
          onClose={handleClosePopup}
          selectedProduct={selectedProduct}
          isSubmitted={isSubmitted}
          isSubmitting={isSubmitting}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleFormSubmit} // מעבירים את הפונקציה המתוקנת
          errors={errors}
        />

        {/* Floating CTA */}
        <FloatingCta showPopup={showPopup} onOpen={() => setShowPopup(true)} />
      </div>
    </>
  );
}