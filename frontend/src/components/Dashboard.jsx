import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL || '';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leads/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  // פורמט תאריך
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // קבלת צבע סטטוס
  const getStatusColor = (status) => {
    const colors = {
      new: '#3b82f6',
      contacted: '#f59e0b',
      converted: '#10b981',
      closed: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'חדש',
      contacted: 'נוצר קשר',
      converted: 'הומר ללקוח',
      closed: 'סגור'
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div style={styles.loading}>טוען נתונים...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>דשבורד לידים</h1>
      
      {/* Stats Cards */}
      <div style={styles.cardsGrid}>
        <div style={{...styles.card, borderTop: '4px solid #3b82f6'}}>
          <div style={styles.cardIcon}>📊</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{stats.total}</div>
            <div style={styles.cardLabel}>סה"כ לידים</div>
          </div>
        </div>
        
        <div style={{...styles.card, borderTop: '4px solid #10b981'}}>
          <div style={styles.cardIcon}>📅</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{stats.newToday}</div>
            <div style={styles.cardLabel}>לידים היום</div>
          </div>
        </div>
        
        <div style={{...styles.card, borderTop: '4px solid #f59e0b'}}>
          <div style={styles.cardIcon}>📈</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{stats.newThisWeek}</div>
            <div style={styles.cardLabel}>לידים השבוע</div>
          </div>
        </div>
        
        <div style={{...styles.card, borderTop: '4px solid #8b5cf6'}}>
          <div style={styles.cardIcon}>🎯</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{stats.conversionRate}%</div>
            <div style={styles.cardLabel}>אחוז המרה</div>
          </div>
        </div>
      </div>

      <div style={styles.row}>
        {/* Status Distribution */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>לידים לפי סטטוס</h2>
          <div style={styles.statusList}>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} style={styles.statusItem}>
                <div style={styles.statusInfo}>
                  <div 
                    style={{
                      ...styles.statusDot,
                      backgroundColor: getStatusColor(status)
                    }}
                  />
                  <span style={styles.statusName}>{getStatusLabel(status)}</span>
                </div>
                <div style={styles.statusCount}>{count}</div>
                <div style={styles.statusBar}>
                  <div 
                    style={{
                      ...styles.statusBarFill,
                      width: `${(count / stats.total) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Distribution */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>לידים לפי מקור</h2>
          <div style={styles.sourceList}>
            {Object.entries(stats.bySource).map(([source, count]) => (
              <div key={source} style={styles.sourceItem}>
                <span style={styles.sourceName}>
                  {source === 'website' ? '🌐 אתר' :
                   source === 'facebook' ? '📘 פייסבוק' :
                   source === 'instagram' ? '📸 אינסטגרם' :
                   source === 'referral' ? '👥 המלצה' : 
                   `📌 ${source}`}
                </span>
                <span style={styles.sourceCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>לידים אחרונים</h2>
        <div style={styles.recentList}>
          {stats.recentLeads.map(lead => (
            <div key={lead._id} style={styles.recentItem}>
              <div style={styles.recentInfo}>
                <div style={styles.recentName}>{lead.name}</div>
                <div style={styles.recentEmail}>{lead.email}</div>
              </div>
              <div style={styles.recentRight}>
                <span 
                  style={{
                    ...styles.recentStatus,
                    backgroundColor: getStatusColor(lead.status)
                  }}
                >
                  {getStatusLabel(lead.status)}
                </span>
                <div style={styles.recentDate}>{formatDate(lead.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.quickStats}>
        <div style={styles.quickStat}>
          <span style={styles.quickLabel}>לידים החודש:</span>
          <span style={styles.quickValue}>{stats.newThisMonth}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickLabel}>ממתינים לטיפול:</span>
          <span style={styles.quickValue}>{stats.byStatus.new || 0}</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.quickLabel}>הומרו ללקוחות:</span>
          <span style={styles.quickValue}>{stats.byStatus.converted || 0}</span>
        </div>
      </div>
    </div>
  );
};

// סגנונות
const styles = {
  container: {
    direction: 'rtl',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '25px',
    color: '#1f2937'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#6b7280',
    fontSize: '18px'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  cardIcon: {
    fontSize: '32px'
  },
  cardContent: {
    flex: 1
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  cardLabel: {
    fontSize: '14px',
    color: '#6b7280'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1f2937'
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  statusInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '120px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  statusName: {
    fontSize: '14px',
    color: '#374151'
  },
  statusCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    width: '40px',
    textAlign: 'center'
  },
  statusBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  statusBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  sourceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sourceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  sourceName: {
    fontSize: '14px',
    color: '#374151'
  },
  sourceCount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937'
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  recentInfo: {
    flex: 1
  },
  recentName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937'
  },
  recentEmail: {
    fontSize: '12px',
    color: '#6b7280'
  },
  recentRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px'
  },
  recentStatus: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    color: 'white'
  },
  recentDate: {
    fontSize: '11px',
    color: '#9ca3af'
  },
  quickStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    flexWrap: 'wrap'
  },
  quickStat: {
    textAlign: 'center'
  },
  quickLabel: {
    fontSize: '14px',
    color: '#6b7280',
    display: 'block',
    marginBottom: '5px'
  },
  quickValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937'
  }
};

export default Dashboard;
