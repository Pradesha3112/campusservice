import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { FiActivity, FiUser, FiClock } from 'react-icons/fi';

const AuditLogs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useTheme();
  const logs = [
    { user: 'Admin', action: 'Verified request #SR-00001', time: '10:30 AM' },
    { user: 'Admin', action: 'Assigned staff to #SR-00001', time: '10:32 AM' },
    { user: 'Staff', action: 'Started work on #SR-00001', time: '11:00 AM' },
    { user: 'Staff', action: 'Completed #SR-00001', time: '2:00 PM' },
    { user: 'Student', action: 'Rated #SR-00001 - 5 stars', time: '2:30 PM' },
  ];

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    logItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: darkMode ? '#1e293b' : '#fff', borderRadius: '8px', marginBottom: '8px', border: darkMode ? '1px solid #334155' : 'none' },
    icon: { width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' },
    logAction: { flex: 1, color: darkMode ? '#cbd5e1' : '#475569', fontSize: '14px' },
    logTime: { color: '#64748b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' },
  };

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}><FiActivity style={{ marginRight: '8px' }} />Audit Logs</h2>
          {logs.map((log, i) => (
            <div key={i} style={styles.logItem}>
              <div style={styles.icon}><FiUser /></div>
              <div style={styles.logAction}><strong>{log.user}</strong> - {log.action}</div>
              <div style={styles.logTime}><FiClock /> {log.time}</div>
            </div>
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default AuditLogs;
