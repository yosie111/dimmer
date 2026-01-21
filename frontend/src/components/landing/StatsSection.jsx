import React from 'react';
import { styles } from './styles';

const stats = [
  { number: '5,000+', label: 'לקוחות מרוצים' },
  { number: '98%', label: 'שביעות רצון' },
  { number: '3 שנים', label: 'אחריות' }
];

const StatsSection = () => {
  return (
    <section style={styles.statsSection}>
      {stats.map((stat, index) => (
        <div key={index} style={styles.statItem}>
          <div style={styles.statNumber}>{stat.number}</div>
          <div style={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </section>
  );
};

export default StatsSection;
