import React, { useState, useEffect, useRef } from 'react';
import {
  Hero,
  ProductShowcase,
  FeaturesStrip,
  StatsSection,
  CTASection,
  LeadFormPopup,
  FloatingCTA,
  styles,
  keyframes
} from './landing';

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
          productInterest: selectedProduct?.sku || selectedProduct?.name || formData.productInterest
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

  const openPopup = () => {
    setShowPopup(true);
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Background Effects */}
        <div style={styles.bgGradient}></div>
        <div style={styles.glowOrb1}></div>
        <div style={styles.glowOrb2}></div>

        {/* Hero Section */}
        <Hero isVisible={isVisible} />

        {/* Product Showcase */}
        <ProductShowcase 
          products={products}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          onProductClick={openPopupWithProduct}
        />

        {/* Features Strip */}
        <FeaturesStrip />

        {/* Stats Section */}
        <StatsSection />

        {/* CTA Section */}
        <CTASection onOpenPopup={openPopup} />

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© 2024 Dimmer. כל הזכויות שמורות.</p>
        </footer>

        {/* Lead Form Popup */}
        <LeadFormPopup
          showPopup={showPopup}
          selectedProduct={selectedProduct}
          formData={formData}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
          onClose={closePopup}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {/* Floating CTA Button */}
        <FloatingCTA 
          show={!showPopup}
          onClick={openPopup}
        />
      </div>
    </>
  );
};

export default LandingPage;
