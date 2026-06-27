import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { FiEye } from 'react-icons/fi';
import api from '../../services/api';

const RequestHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/student/my-requests');
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter((r) => {
    if (filter === 'active') return !['Closed', 'Rejected'].includes(r.status);
    if (filter === 'completed') return r.status === 'Closed';
    return r.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = { Submitted: '#f59e0b', Verified: '#3b82f6', Assigned: '#8b5cf6', In_Progress: '#f97316', Waiting_Verification: '#14b8a6', Completed: '#10b981', Closed: '#10b981', Rejected: '#ef4444', Reopened: '#ec4899' };
    return colors[status] || '#64748b';
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    filters: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
    filterBtn: (active) => ({
      padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
      background: active ? '#4f46e5' : darkMode ? '#334155' : '#e2e8f0',
      color: active ? '#fff' : darkMode ? '#94a3b8' : '#475569',
    }),
    card: {
      background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '12px', padding: '16px', marginBottom: '12px',
      border: darkMode ? '1px solid #334155' : 'none',
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
    },
    badge: (bg) => ({ background: bg, color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }),
    empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}>My Requests</h2>

          <div style={styles.filters}>
            {['all', 'active', 'Completed', 'Closed', 'Rejected'].map((f) => (
              <button key={f} style={styles.filterBtn(filter === f)} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={styles.empty}>No requests found. <Link to="/student/raise-request">Raise a new request</Link></div>
          ) : (
            filtered.map((req) => (
              <div key={req._id} style={styles.card}>
                <div>
                  <div style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' }}>
                    {req.requestId} - {req.serviceType}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {req.building}, Floor {req.floor}, Room {req.room} | {req.category}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={styles.badge(getStatusColor(req.status))}>{req.status.replace('_', ' ')}</span>
                  <Link to={`/student/request/${req._id}`} style={{ color: '#4f46e5', fontSize: '18px' }}><FiEye /></Link>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RequestHistory;