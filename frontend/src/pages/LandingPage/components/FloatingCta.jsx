import React from "react";
import { styles } from "../styles";

export function FloatingCta({ showPopup, onOpen }) {
  if (showPopup) return null;

  return (
    <button style={styles.floatingCta} onClick={onOpen}>
      💬 צור קשר
    </button>
  );
}
