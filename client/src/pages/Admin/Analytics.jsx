import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { FiBarChart2, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data.stats)).finally(() => setLoading(false));
  }, []);

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' },
    card: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '20px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' },
    icon: (bg) => ({ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff' }),
    val: { fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b' },
    lbl: { fontSize: '13px', color: '#64748b' },
    section: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '20px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    bar: (w, c) => ({ height: '8px', borderRadius: '4px', background: c, width: `${w}%`, transition: 'width 0.5s', marginBottom: '8px' }),
    barLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: darkMode ? '#cbd5e1' : '#475569', marginBottom: '4px' },
  };

  if (loading) return <Loader />;

  const total = stats?.totalRequests || 1;
  const getPercent = (v) => Math.round((v / total) * 100);

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}><FiBarChart2 style={{ marginRight: '8px' }} />Analytics Dashboard</h2>
          <div style={styles.grid}>
            <div style={styles.card}><div style={styles.icon('#4f46e5')}><FiTrendingUp /></div><div><div style={styles.val}>{stats?.totalRequests || 0}</div><div style={styles.lbl}>Total Requests</div></div></div>
            <div style={styles.card}><div style={styles.icon('#f59e0b')}><FiClock /></div><div><div style={styles.val}>{stats?.pendingRequests || 0}</div><div style={styles.lbl}>Pending</div></div></div>
            <div style={styles.card}><div style={styles.icon('#10b981')}><FiCheckCircle /></div><div><div style={styles.val}>{stats?.completedRequests || 0}</div><div style={styles.lbl}>Completed</div></div></div>
            <div style={styles.card}><div style={styles.icon('#ef4444')}><FiTrendingUp /></div><div><div style={styles.val}>{stats?.reopenedRequests || 0}</div><div style={styles.lbl}>Reopened</div></div></div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Request Distribution</h3>
            <div style={styles.barLabel}><span>Completed</span><span>{getPercent(stats?.completedRequests || 0)}%</span></div>
            <div style={styles.bar(getPercent(stats?.completedRequests || 0), '#10b981')}></div>
            <div style={styles.barLabel}><span>Pending</span><span>{getPercent(stats?.pendingRequests || 0)}%</span></div>
            <div style={styles.bar(getPercent(stats?.pendingRequests || 0), '#f59e0b')}></div>
            <div style={styles.barLabel}><span>Rejected</span><span>{getPercent(stats?.rejectedRequests || 0)}%</span></div>
            <div style={styles.bar(getPercent(stats?.rejectedRequests || 0), '#ef4444')}></div>
            <div style={styles.barLabel}><span>Reopened</span><span>{getPercent(stats?.reopenedRequests || 0)}%</span></div>
            <div style={styles.bar(getPercent(stats?.reopenedRequests || 0), '#ec4899')}></div>
          </div>

          {stats?.categoryWise && stats.categoryWise.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Category-wise Breakdown</h3>
              {stats.categoryWise.map(c => (
                <div key={c._id}>
                  <div style={styles.barLabel}><span>{c._id}</span><span>{c.count} requests</span></div>
                  <div style={styles.bar((c.count / total) * 100, '#6366f1')}></div>
                </div>
              ))}
            </div>
          )}

          {stats?.staffWorkload && stats.staffWorkload.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Staff Workload</h3>
              {stats.staffWorkload.map(s => (
                <div key={s._id}>
                  <div style={styles.barLabel}><span>{s.name} ({s.currentLoad}/{s.capacity})</span><span style={{ color: s.availability ? '#10b981' : '#ef4444' }}>{s.availability ? 'Available' : 'Busy'}</span></div>
                  <div style={styles.bar((s.currentLoad / s.capacity) * 100, s.currentLoad >= s.capacity ? '#ef4444' : '#10b981')}></div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default Analytics;
