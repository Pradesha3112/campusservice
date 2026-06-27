import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { FiPlusCircle, FiList, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/my-requests');
        const requests = res.data.requests || [];
        setRecentRequests(requests.slice(0, 5));

        const total = requests.length;
        const completed = requests.filter((r) => r.status === 'Closed' || r.status === 'Completed').length;
        const pending = requests.filter((r) => !['Closed', 'Rejected', 'Completed'].includes(r.status)).length;
        const rejected = requests.filter((r) => r.status === 'Rejected').length;

        setStats({ total, completed, pending, rejected });
      } catch (err) {
        console.error('Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      Submitted: '#f59e0b', Verified: '#3b82f6', Assigned: '#8b5cf6',
      In_Progress: '#f97316', Waiting_Verification: '#14b8a6',
      Completed: '#10b981', Closed: '#10b981', Rejected: '#ef4444', Reopened: '#ec4899',
    };
    return colors[status] || '#64748b';
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px', transition: 'margin 0.3s' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
    statCard: {
      background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '12px', padding: '20px',
      border: darkMode ? '1px solid #334155' : 'none',
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', gap: '16px',
    },
    statIcon: (bg) => ({
      width: '48px', height: '48px', borderRadius: '12px', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff',
    }),
    statValue: { fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b' },
    statLabel: { fontSize: '13px', color: '#64748b' },
    section: {
      background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '12px', padding: '20px',
      border: darkMode ? '1px solid #334155' : 'none',
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
      marginBottom: '24px',
    },
    sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px 12px', borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: '600' },
    td: { padding: '10px 12px', borderBottom: darkMode ? '1px solid #1e293b' : '1px solid #f1f5f9', fontSize: '14px', color: darkMode ? '#cbd5e1' : '#475569' },
    badge: (bg) => ({
      background: bg, color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-block',
    }),
    quickBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
      borderRadius: '10px', border: 'none', backgroundColor: '#4f46e5', color: '#fff',
      fontSize: '15px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none',
      marginRight: '12px', marginBottom: '12px',
    },
    welcome: { fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    welcomeSub: { color: '#64748b', marginBottom: '24px' },
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.welcome}>Welcome, {user?.name}!</h2>
          <p style={styles.welcomeSub}>Here's an overview of your service requests</p>

          <div style={{ marginBottom: '24px' }}>
            <Link to="/student/raise-request" style={styles.quickBtn}>
              <FiPlusCircle /> Raise New Request
            </Link>
            <Link to="/student/my-requests" style={{ ...styles.quickBtn, background: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#f1f5f9' : '#1e293b' }}>
              <FiList /> View All Requests
            </Link>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon('#4f46e5')}><FiList /></div>
              <div><div style={styles.statValue}>{stats?.total || 0}</div><div style={styles.statLabel}>Total Requests</div></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon('#f59e0b')}><FiClock /></div>
              <div><div style={styles.statValue}>{stats?.pending || 0}</div><div style={styles.statLabel}>Pending</div></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon('#10b981')}><FiCheckCircle /></div>
              <div><div style={styles.statValue}>{stats?.completed || 0}</div><div style={styles.statLabel}>Completed</div></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon('#ef4444')}><FiAlertCircle /></div>
              <div><div style={styles.statValue}>{stats?.rejected || 0}</div><div style={styles.statLabel}>Rejected</div></div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Recent Requests</h3>
            {recentRequests.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Request ID</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => (
                    <tr key={req._id}>
                      <td style={styles.td}><Link to={`/student/request/${req._id}`} style={{ color: '#4f46e5' }}>{req.requestId}</Link></td>
                      <td style={styles.td}>{req.category}</td>
                      <td style={styles.td}>{req.serviceType}</td>
                      <td style={styles.td}><span style={styles.badge(getStatusColor(req.status))}>{req.status.replace('_', ' ')}</span></td>
                      <td style={styles.td}>{new Date(req.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No requests yet. Raise your first request!</p>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;