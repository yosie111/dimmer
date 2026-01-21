import React, { useState, useEffect, useCallback } from 'react';

const LeadsManager = () => {
  // State
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  
  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Edit Modal
  const [editingLead, setEditingLead] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // סטטוסים
  const STATUSES = [
    { value: 'new', label: 'חדש', color: '#3b82f6' },
    { value: 'contacted', label: 'נוצר קשר', color: '#f59e0b' },
    { value: 'converted', label: 'הומר ללקוח', color: '#10b981' },
    { value: 'closed', label: 'סגור', color: '#6b7280' }
  ];

  // שליפת לידים
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);

      const response = await fetch(`/api/leads?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data);
        setTotal(data.total);
        setPages(data.pages);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('שגיאה בטעינת הלידים');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, sourceFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // עדכון סטטוס
  const updateLeadStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchLeads();
      }
    } catch (err) {
      setError('שגיאה בעדכון הסטטוס');
    }
  };

  // מחיקת ליד
  const deleteLead = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הליד?')) return;
    
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchLeads();
      }
    } catch (err) {
      setError('שגיאה במחיקת הליד');
    }
  };

  // שמירת עריכה
  const saveLead = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/leads/${editingLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLead)
      });
      
      if (response.ok) {
        setShowModal(false);
        setEditingLead(null);
        fetchLeads();
      }
    } catch (err) {
      setError('שגיאה בשמירת הליד');
    }
  };

  // מיון
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
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
    return STATUSES.find(s => s.value === status)?.color || '#6b7280';
  };

  const getStatusLabel = (status) => {
    return STATUSES.find(s => s.value === status)?.label || status;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ניהול לידים</h1>
      
      {error && <div style={styles.error}>{error}</div>}
      
      {/* Filters & Search */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="חיפוש לפי שם, טלפון או אימייל..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={styles.select}
          >
            <option value="">כל הסטטוסים</option>
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            style={styles.select}
          >
            <option value="">כל המקורות</option>
            <option value="website">אתר</option>
            <option value="facebook">פייסבוק</option>
            <option value="instagram">אינסטגרם</option>
            <option value="referral">המלצה</option>
            <option value="other">אחר</option>
          </select>
          
          <select
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
            style={styles.select}
          >
            <option value="5">5 לעמוד</option>
            <option value="10">10 לעמוד</option>
            <option value="25">25 לעמוד</option>
            <option value="50">50 לעמוד</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div style={styles.summary}>
        מציג {leads.length} מתוך {total} לידים | עמוד {page} מתוך {pages || 1}
      </div>

      {/* Table */}
      {loading ? (
        <div style={styles.loading}>טוען...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => handleSort('name')}>
                  שם {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th} onClick={() => handleSort('email')}>
                  אימייל {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th}>טלפון</th>
                <th style={styles.th}>מקור</th>
                <th style={styles.th}>סטטוס</th>
                <th style={styles.th} onClick={() => handleSort('createdAt')}>
                  תאריך {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id} style={styles.tr}>
                  <td style={styles.td}>{lead.name}</td>
                  <td style={styles.td}>{lead.email}</td>
                  <td style={styles.td}>{lead.phone}</td>
                  <td style={styles.td}>{lead.source}</td>
                  <td style={styles.td}>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                      style={{
                        ...styles.statusSelect,
                        backgroundColor: getStatusColor(lead.status),
                        color: 'white'
                      }}
                    >
                      {STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td style={styles.td}>{formatDate(lead.createdAt)}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => { setEditingLead({...lead}); setShowModal(true); }}
                      style={styles.editBtn}
                    >
                      ערוך
                    </button>
                    <button
                      onClick={() => deleteLead(lead._id)}
                      style={styles.deleteBtn}
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            style={styles.pageBtn}
          >
            ראשון
          </button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={styles.pageBtn}
          >
            הקודם
          </button>
          
          {[...Array(Math.min(5, pages))].map((_, i) => {
            const pageNum = Math.max(1, Math.min(page - 2, pages - 4)) + i;
            if (pageNum > pages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                style={{
                  ...styles.pageBtn,
                  backgroundColor: page === pageNum ? '#3b82f6' : '#f3f4f6',
                  color: page === pageNum ? 'white' : '#374151'
                }}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            style={styles.pageBtn}
          >
            הבא
          </button>
          <button
            onClick={() => setPage(pages)}
            disabled={page === pages}
            style={styles.pageBtn}
          >
            אחרון
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingLead && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>עריכת ליד</h2>
            <form onSubmit={saveLead}>
              <div style={styles.formGroup}>
                <label style={styles.label}>שם:</label>
                <input
                  type="text"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>טלפון:</label>
                <input
                  type="text"
                  value={editingLead.phone}
                  onChange={(e) => setEditingLead({...editingLead, phone: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>אימייל:</label>
                <input
                  type="email"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({...editingLead, email: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>הודעה:</label>
                <textarea
                  value={editingLead.message || ''}
                  onChange={(e) => setEditingLead({...editingLead, message: e.target.value})}
                  style={styles.textarea}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>מקור:</label>
                <select
                  value={editingLead.source}
                  onChange={(e) => setEditingLead({...editingLead, source: e.target.value})}
                  style={styles.input}
                >
                  <option value="website">אתר</option>
                  <option value="facebook">פייסבוק</option>
                  <option value="instagram">אינסטגרם</option>
                  <option value="referral">המלצה</option>
                  <option value="other">אחר</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>עניין במוצר:</label>
                <input
                  type="text"
                  value={editingLead.productInterest || ''}
                  onChange={(e) => setEditingLead({...editingLead, productInterest: e.target.value})}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>סטטוס:</label>
                <select
                  value={editingLead.status}
                  onChange={(e) => setEditingLead({...editingLead, status: e.target.value})}
                  style={styles.input}
                >
                  {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.saveBtn}>שמור</button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingLead(null); }}
                  style={styles.cancelBtn}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// סגנונות
const styles = {
  container: {
    direction: 'rtl',
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
    alignItems: 'center'
  },
  searchBox: {
    flex: '1',
    minWidth: '250px'
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  select: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  summary: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '15px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px 15px',
    textAlign: 'right',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '12px 15px',
    textAlign: 'right',
    color: '#4b5563'
  },
  statusSelect: {
    padding: '5px 10px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  editBtn: {
    padding: '5px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: '5px',
    fontSize: '12px'
  },
  deleteBtn: {
    padding: '5px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  pageBtn: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#f3f4f6',
    cursor: 'pointer',
    fontSize: '14px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    direction: 'rtl'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
};

export default LeadsManager;
