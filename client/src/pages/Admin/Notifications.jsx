import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { FiBell, FiAlertTriangle, FiCheck, FiInfo } from 'react-icons/fi';

const AdminNotifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useTheme();
  const notifications = [
    { id: 1, title: 'New Request', message: 'A new service request #SR-00005 has been submitted.', type: 'info', time: '2 min ago' },
    { id: 2, title: 'Overdue Request', message: 'Request #SR-00002 is overdue by 1 day.', type: 'warning', time: '1 hour ago' },
    { id: 3, title: 'Anonymous Request', message: 'An anonymous sensitive request has been submitted.', type: 'alert', time: '3 hours ago' },
  ];

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    card: { display: 'flex', gap: '12px', padding: '16px', background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', marginBottom: '10px', border: darkMode ? '1px solid #334155' : 'none', borderLeft: '4px solid #4f46e5' },
    icon: (t) => ({ fontSize: '20px', color: t === 'warning' ? '#f59e0b' : t === 'alert' ? '#ef4444' : '#3b82f6', marginTop: '2px' }),
    content: { flex: 1 },
    cardTitle: { fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' },
    cardMsg: { fontSize: '13px', color: '#64748b' },
    cardTime: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' },
  };

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}><FiBell style={{ marginRight: '8px' }} />Notifications</h2>
          {notifications.map(n => (
            <div key={n.id} style={styles.card}>
              <div style={styles.icon(n.type)}>{n.type === 'warning' ? <FiAlertTriangle /> : n.type === 'alert' ? <FiAlertTriangle /> : <FiInfo />}</div>
              <div style={styles.content}><div style={styles.cardTitle}>{n.title}</div><div style={styles.cardMsg}>{n.message}</div><div style={styles.cardTime}>{n.time}</div></div>
            </div>
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default AdminNotifications;
