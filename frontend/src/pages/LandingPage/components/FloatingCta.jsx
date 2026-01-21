import React from "react";
import { styles } from "../styles";

export function FloatingCta({ showPopup, onOpen }) {
  if (showPopup) return null;

  return (
    <button
      className="floating-cta"
      style={styles.floatingCta}
      onClick={onOpen}
      type="button"
    >
      💬 צור קשר
    </button>
  );
}
