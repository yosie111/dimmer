import React from "react";
import { styles } from "../styles";

export function Hero({ isVisible }) {
  return (
    <section
      className="hero-section"
      style={{
        ...styles.hero,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      <div style={styles.badge}>
        <span style={styles.badgeDot}></span>
        <span>חדש! דגמי Mark 2 זמינים</span>
      </div>

      <h1 style={styles.headline}>
        שליטה מושלמת
        <span style={styles.headlineAccent}> בתאורת הבית</span>
      </h1>

      <p style={styles.subheadline}>מתגי דימר חכמים עם עמעום חלק והתקנה פשוטה</p>
    </section>
  );
}