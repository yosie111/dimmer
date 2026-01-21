import React from 'react';
import { styles } from './styles';

const FloatingCTA = ({ show, onClick }) => {
  if (!show) return null;

  return (
    <button 
      style={styles.floatingCta}
      onClick={onClick}
    >
      💬 צור קשר
    </button>
  );
};

export default FloatingCTA;
