import React from "react";
import { styles } from "../styles";

export function LeadPopup({
  show,
  onClose,
  selectedProduct,
  isSubmitted,
  isSubmitting,
  formData,
  onChange,
  onSubmit,
}) {
  if (!show) return null;

  return (
    <div style={styles.popupOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.popupContainer}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {!isSubmitted ? (
          <>
            <div style={styles.popupHeader}>
              <h3 style={styles.popupTitle}>
                {selectedProduct ? "מעוניינים במוצר?" : "קבלו הצעת מחיר"}
              </h3>
              <p style={styles.popupSubtitle}>השאירו פרטים ונחזור אליכם בהקדם</p>
            </div>

            {selectedProduct && (
              <div style={styles.selectedProductBadge}>
                <span>💡</span>
                <span>
                  {selectedProduct.name} - ₪{selectedProduct.price}
                </span>
              </div>
            )}

            <form onSubmit={onSubmit} style={styles.popupForm}>
              <input
                type="text"
                name="name"
                placeholder="שם מלא *"
                value={formData.name}
                onChange={onChange}
                style={styles.popupInput}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="טלפון *"
                value={formData.phone}
                onChange={onChange}
                style={styles.popupInput}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="אימייל *"
                value={formData.email}
                onChange={onChange}
                style={styles.popupInput}
                required
              />
              <textarea
                name="message"
                placeholder="הודעה (אופציונלי)"
                value={formData.message}
                onChange={onChange}
                style={styles.popupTextarea}
              />
              <button type="submit" style={styles.popupSubmitButton} disabled={isSubmitting}>
                {isSubmitting ? "שולח..." : "שלח פרטים"}
              </button>
            </form>

            <p style={styles.privacyNote}>🔒 הפרטים שלכם מאובטחים ולא יועברו לצד שלישי</p>
          </>
        ) : (
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>תודה רבה!</h3>
            <p style={styles.successText}>קיבלנו את הפרטים שלכם ונחזור אליכם בהקדם</p>
          </div>
        )}
      </div>
    </div>
  );
}
