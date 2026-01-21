import React, { useState, useEffect } from 'react';

const LandingPage = () => {
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '', source: 'website', productInterest: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: '"Heebo", "Segoe UI", sans-serif',
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden'
    },
    noise: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      opacity: 0.03,
      pointerEvents: 'none'
    },
    glowOrb1: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      top: '-200px',
      right: '-200px',
      animation: 'float 8s ease-in-out infinite'
    },
    glowOrb2: {
      position: 'absolute',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      bottom: '-150px',
      left: '-150px',
      animation: 'float 10s ease-in-out infinite reverse'
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 48px',
      position: 'relative',
      zIndex: 10,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    logo: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-1px'
    },
    navLinks: {
      display: 'flex',
      gap: '40px',
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    navLink: {
      color: 'rgba(255, 255, 255, 0.7)',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    main: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '80px',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '60px 48px 100px',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10
    },
    heroSection: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
      transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(99, 102, 241, 0.1)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '100px',
      padding: '8px 16px',
      marginBottom: '32px'
    },
    badgeDot: {
      width: '8px',
      height: '8px',
      background: '#10b981',
      borderRadius: '50%',
      animation: 'pulse 2s ease-in-out infinite'
    },
    badgeText: {
      color: '#a5b4fc',
      fontSize: '13px',
      fontWeight: '600',
      letterSpacing: '0.5px'
    },
    headline: {
      fontSize: '64px',
      fontWeight: '800',
      color: '#fff',
      lineHeight: '1.1',
      marginBottom: '24px',
      letterSpacing: '-2px'
    },
    headlineAccent: {
      background: 'linear-gradient(135deg, #818cf8 0%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subheadline: {
      fontSize: '20px',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: '1.7',
      marginBottom: '40px',
      maxWidth: '500px'
    },
    features: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '16px'
    },
    featureIcon: {
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '14px'
    },
    formSection: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
      transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s'
    },
    formCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '48px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    formTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
      textAlign: 'center'
    },
    formSubtitle: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: '32px',
      textAlign: 'center'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      direction: 'rtl'
    },
    textarea: {
      width: '100%',
      padding: '14px 18px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      direction: 'rtl'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
      border: 'none',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px',
      position: 'relative',
      overflow: 'hidden'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
    },
    successMessage: {
      textAlign: 'center',
      padding: '40px 20px'
    },
    successIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      fontSize: '40px'
    },
    successTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '12px'
    },
    successText: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '16px'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginTop: '80px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s'
    },
    statItem: {
      textAlign: 'center',
      padding: '24px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    statNumber: {
      fontSize: '42px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '14px',
      fontWeight: '500'
    },
    footer: {
      textAlign: 'center',
      padding: '32px',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      color: 'rgba(255, 255, 255, 0.4)',
      fontSize: '14px',
      position: 'relative',
      zIndex: 10
    }
  };

  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-30px, 30px) scale(1.05); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.noise}></div>
        <div style={styles.glowOrb1}></div>
        <div style={styles.glowOrb2}></div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <div style={styles.logo}>ProductX</div>
          <ul style={styles.navLinks}>
            <li><a style={styles.navLink}>יתרונות</a></li>
            <li><a style={styles.navLink}>תמחור</a></li>
            <li><a style={styles.navLink}>אודות</a></li>
            <li><a style={styles.navLink}>צור קשר</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <main style={styles.main}>
          {/* Hero Section */}
          <section style={styles.heroSection}>
            <div style={styles.badge}>
              <span style={styles.badgeDot}></span>
              <span style={styles.badgeText}>חדש! גרסה 2.0 זמינה</span>
            </div>
            
            <h1 style={styles.headline}>
              הדרך החכמה ביותר
              <br />
              <span style={styles.headlineAccent}>לצמיחה עסקית</span>
            </h1>
            
            <p style={styles.subheadline}>
              פתרון מקצה לקצה שמאיץ את הביצועים העסקיים שלך. 
              הצטרף לאלפי לקוחות מרוצים שכבר גילו את הסוד.
            </p>

            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>✓</span>
                <span>התקנה מהירה תוך 5 דקות</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>✓</span>
                <span>תמיכה 24/7 בעברית</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>✓</span>
                <span>14 ימי ניסיון חינם</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>✓</span>
                <span>ללא התחייבות, בטל בכל עת</span>
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section style={styles.formSection}>
            <div style={styles.formCard}>
              {!isSubmitted ? (
                <>
                  <h2 style={styles.formTitle}>התחילו עכשיו</h2>
                  <p style={styles.formSubtitle}>השאירו פרטים ונחזור אליכם תוך 24 שעות</p>
                  
                  <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>שם מלא *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="ישראל ישראלי"
                        required
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>אימייל *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{...styles.input, direction: 'ltr', textAlign: 'right'}}
                        placeholder="example@email.com"
                        required
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>טלפון *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{...styles.input, direction: 'ltr', textAlign: 'right'}}
                        placeholder="050-000-0000"
                        required
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>מוצר שמעניין</label>
                      <select
                        name="productInterest"
                        value={formData.productInterest}
                        onChange={handleChange}
                        style={{...styles.input, cursor: 'pointer'}}
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                      >
                        <option value="">בחר מוצר...</option>
                        <option value="basic">חבילה בסיסית</option>
                        <option value="premium">חבילת פרימיום</option>
                        <option value="business">חבילה עסקית</option>
                        <option value="enterprise">חבילת Enterprise</option>
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>הודעה</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="ספרו לנו קצת על הצרכים שלכם..."
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                      />
                    </div>

                    <button
                      type="submit"
                      style={styles.submitButton}
                      disabled={isSubmitting}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {isSubmitting ? 'שולח...' : 'שלחו לי פרטים'}
                    </button>
                  </form>
                </>
              ) : (
                <div style={styles.successMessage}>
                  <div style={styles.successIcon}>✓</div>
                  <h3 style={styles.successTitle}>תודה רבה!</h3>
                  <p style={styles.successText}>קיבלנו את הפרטים שלך ונחזור אליך בהקדם</p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Stats Section */}
        <div style={{...styles.stats, maxWidth: '1400px', margin: '0 auto', padding: '0 48px'}}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>לקוחות מרוצים</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>98%</div>
            <div style={styles.statLabel}>שביעות רצון</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>תמיכה זמינה</div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© 2024 ProductX. כל הזכויות שמורות.</p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
