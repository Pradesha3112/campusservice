import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { FiList, FiClock, FiCheckCircle, FiXCircle, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import api from '../../services/api';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.stats);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '24px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' },
    sub: { color: '#64748b', marginBottom: '24px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' },
    card: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '20px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' },
    icon: (bg) => ({ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff' }),
    val: { fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b' },
    lbl: { fontSize: '13px', color: '#64748b' },
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}>Admin Dashboard</h2>
          <p style={styles.sub}>System overview & statistics</p>
          <div style={styles.grid}>
            <div style={styles.card}><div style={styles.icon('#4f46e5')}><FiList /></div><div><div style={styles.val}>{stats?.totalRequests || 0}</div><div style={styles.lbl}>Total Requests</div></div></div>
            <div style={styles.card}><div style={styles.icon('#f59e0b')}><FiClock /></div><div><div style={styles.val}>{stats?.pendingRequests || 0}</div><div style={styles.lbl}>Pending</div></div></div>
            <div style={styles.card}><div style={styles.icon('#10b981')}><FiCheckCircle /></div><div><div style={styles.val}>{stats?.completedRequests || 0}</div><div style={styles.lbl}>Completed</div></div></div>
            <div style={styles.card}><div style={styles.icon('#ef4444')}><FiXCircle /></div><div><div style={styles.val}>{stats?.rejectedRequests || 0}</div><div style={styles.lbl}>Rejected</div></div></div>
            <div style={styles.card}><div style={styles.icon('#ec4899')}><FiRefreshCw /></div><div><div style={styles.val}>{stats?.reopenedRequests || 0}</div><div style={styles.lbl}>Reopened</div></div></div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default AdminDashboard;
