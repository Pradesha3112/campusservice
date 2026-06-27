import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FiCheck, FiX, FiUserPlus, FiClock, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';

const VerifyRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [priority, setPriority] = useState('Medium');
  const { darkMode } = useTheme();

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/requests?status=Submitted');
      setRequests(res.data.requests || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff');
      setStaffList(res.data.staff || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRequests(); fetchStaff(); }, []);

  const verifyAndAssign = async (id) => {
    if (!selectedStaff) {
      setToast({ message: 'Please select a staff member', type: 'error' });
      return;
    }
    try {
      // First verify
      await api.put(`/admin/verify/${id}`, { priority });
      // Then assign
      await api.put(`/admin/assign/${id}`, { staffId: selectedStaff });
      setToast({ message: 'Request verified & staff assigned!', type: 'success' });
      setAssigningId(null);
      setSelectedStaff('');
      setPriority('Medium');
      fetchRequests();
      fetchStaff();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to assign', type: 'error' });
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.put(`/admin/reject/${id}`);
      setToast({ message: 'Request rejected!', type: 'success' });
      fetchRequests();
    } catch (err) {
      setToast({ message: 'Failed to reject', type: 'error' });
    }
  };

  const getAvailableStaff = () => staffList.filter(s => s.availability);

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    card: {
      background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '20px', marginBottom: '12px',
      border: darkMode ? '1px solid #334155' : 'none',
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' },
    requestInfo: { flex: 1 },
    requestId: { fontSize: '14px', fontWeight: '700', color: '#4f46e5', marginBottom: '4px' },
    serviceType: { fontSize: '16px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' },
    location: { fontSize: '13px', color: '#64748b' },
    reporter: { fontSize: '13px', color: '#64748b', marginTop: '2px' },
    description: { fontSize: '14px', color: darkMode ? '#cbd5e1' : '#475569', marginTop: '8px', padding: '10px', background: darkMode ? '#0f172a' : '#f8fafc', borderRadius: '8px', lineHeight: '1.5' },
    actionBar: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '12px' },
    btn: (bg) => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', background: bg, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }),
    outlineBtn: { padding: '8px 16px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: darkMode ? '#94a3b8' : '#64748b' },
    select: { padding: '8px 12px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', background: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '13px', outline: 'none', cursor: 'pointer', minWidth: '180px' },
    assignPanel: { marginTop: '12px', padding: '16px', background: darkMode ? '#0f172a' : '#f8fafc', borderRadius: '10px', border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0' },
    assignTitle: { fontSize: '14px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '12px' },
    staffInfo: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
    staffTag: (avl) => ({ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: avl ? '#d1fae5' : '#fee2e2', color: avl ? '#065f46' : '#991b1b', display: 'inline-flex', alignItems: 'center', gap: '4px' }),
    badge: { background: '#f59e0b', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}>Verify & Assign Requests</h2>
          
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <FiCheck style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600' }}>No pending requests</p>
              <p style={{ fontSize: '14px' }}>All requests have been processed</p>
            </div>
          ) : (
            requests.map(r => (
              <div key={r._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.requestInfo}>
                    <div style={styles.requestId}>{r.requestId}</div>
                    <div style={styles.serviceType}>{r.category} - {r.serviceType}</div>
                    <div style={styles.location}>📍 {r.building}, Floor {r.floor}, Room {r.room}</div>
                    <div style={styles.reporter}>👤 Reported by: {r.studentId?.name || 'Unknown'}</div>
                    {r.image && <div style={{ marginTop: '8px' }}>📷 Image attached</div>}
                  </div>
                  <span style={styles.badge}>Pending Review</span>
                </div>

                <div style={styles.description}>
                  <strong>Description:</strong> {r.description}
                </div>

                {/* Assignment Panel */}
                {assigningId === r._id ? (
                  <div style={styles.assignPanel}>
                    <div style={styles.assignTitle}>⚙️ Assign Staff & Set Priority</div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                      <select style={styles.select} value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="High">🔴 High Priority (4 hours)</option>
                        <option value="Medium">🟡 Medium Priority (1 day)</option>
                        <option value="Low">🟢 Low Priority (3 days)</option>
                      </select>
                      <select style={styles.select} value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
                        <option value="">-- Select Staff --</option>
                        {staffList.map(s => (
                          <option key={s._id} value={s._id} disabled={!s.availability}>
                            {s.name} ({s.department || 'General'}) - {s.currentLoad}/{s.capacity} {!s.availability ? '[BUSY]' : '[Available]'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.staffInfo}>
                      {staffList.map(s => (
                        <span key={s._id} style={styles.staffTag(s.availability)}>
                          {s.availability ? '✅' : '❌'} {s.name}: {s.currentLoad}/{s.capacity}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button style={styles.btn('#10b981')} onClick={() => verifyAndAssign(r._id)}>
                        <FiUserPlus /> Confirm Assign
                      </button>
                      <button style={styles.outlineBtn} onClick={() => { setAssigningId(null); setSelectedStaff(''); }}>
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.actionBar}>
                    <button style={styles.btn('#10b981')} onClick={() => setAssigningId(r._id)}>
                      <FiUserPlus /> Assign Staff
                    </button>
                    <button style={styles.btn('#ef4444')} onClick={() => rejectRequest(r._id)}>
                      <FiX /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyRequests;