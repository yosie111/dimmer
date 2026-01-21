import React from 'react';
import { styles } from './styles';

const CTASection = ({ onOpenPopup }) => {
  return (
    <section style={styles.ctaSection}>
      <h2 style={styles.ctaTitle}>מעוניינים לשמוע עוד?</h2>
      <p style={styles.ctaSubtitle}>השאירו פרטים ונחזור אליכם עם הצעת מחיר מותאמת</p>
      <button 
        style={styles.ctaButton}
        onClick={onOpenPopup}
      >
        צור קשר עכשיו
      </button>
    </section>
  );
};

export default CTASection;
