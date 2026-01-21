import React from 'react';
import { styles } from './styles';

const features = [
  { icon: '🎛️', text: 'שליטה מרחוק' },
  { icon: '✨', text: 'עמעום חלק' },
  { icon: '⚡', text: 'התקנה פשוטה' },
  { icon: '🛡️', text: '3 שנות אחריות' }
];

const FeaturesStrip = () => {
  return (
    <section style={styles.featuresStrip}>
      {features.map((feature, index) => (
        <div key={index} style={styles.featureItem}>
          <span style={styles.featureIcon}>{feature.icon}</span>
          <span style={styles.featureText}>{feature.text}</span>
        </div>
      ))}
    </section>
  );
};

export default FeaturesStrip;
