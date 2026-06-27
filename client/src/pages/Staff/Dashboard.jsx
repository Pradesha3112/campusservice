import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { FiClipboard, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../../services/api';

const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ active: 0, completed: 0, total: 0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/staff/my-tasks');
        const all = res.data.requests || [];
        setTasks(all.slice(0, 5));
        setStats({
          total: all.length,
          active: all.filter(t => !['Closed', 'Completed'].includes(t.status)).length,
          completed: all.filter(t => t.status === 'Closed' || t.status === 'Completed').length,
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTasks();
  }, []);

  const getStatusColor = (s) => {
    const c = { Submitted: '#f59e0b', Assigned: '#8b5cf6', In_Progress: '#f97316', Waiting_Verification: '#14b8a6', Completed: '#10b981', Closed: '#10b981' };
    return c[s] || '#64748b';
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    welcome: { fontSize: '24px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' },
    sub: { color: '#64748b', marginBottom: '24px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
    card: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '20px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' },
    icon: (bg) => ({ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff' }),
    val: { fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b' },
    lbl: { fontSize: '13px', color: '#64748b' },
    section: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '20px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' },
    sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px 12px', borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: '600' },
    td: { padding: '10px 12px', borderBottom: darkMode ? '1px solid #1e293b' : '1px solid #f1f5f9', fontSize: '14px', color: darkMode ? '#cbd5e1' : '#475569' },
    badge: (bg) => ({ background: bg, color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }),
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.welcome}>Welcome, {user?.name}!</h2>
          <p style={styles.sub}>Here's your task overview</p>
          <div style={styles.grid}>
            <div style={styles.card}><div style={styles.icon('#4f46e5')}><FiClipboard /></div><div><div style={styles.val}>{stats.total}</div><div style={styles.lbl}>Total Tasks</div></div></div>
            <div style={styles.card}><div style={styles.icon('#f59e0b')}><FiClock /></div><div><div style={styles.val}>{stats.active}</div><div style={styles.lbl}>Active</div></div></div>
            <div style={styles.card}><div style={styles.icon('#10b981')}><FiCheckCircle /></div><div><div style={styles.val}>{stats.completed}</div><div style={styles.lbl}>Completed</div></div></div>
          </div>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Recent Tasks</h3>
            {tasks.length > 0 ? (
              <table style={styles.table}><thead><tr><th style={styles.th}>ID</th><th style={styles.th}>Category</th><th style={styles.th}>Room</th><th style={styles.th}>Status</th></tr></thead>
                <tbody>{tasks.map(t => (
                  <tr key={t._id}><td style={styles.td}><Link to={`/staff/request/${t._id}`} style={{ color: '#4f46e5' }}>{t.requestId}</Link></td><td style={styles.td}>{t.category}</td><td style={styles.td}>{t.room}</td><td style={styles.td}><span style={styles.badge(getStatusColor(t.status))}>{t.status.replace('_', ' ')}</span></td></tr>
                ))}</tbody>
              </table>
            ) : <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No tasks assigned yet.</p>}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StaffDashboard;
