import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { FiBell, FiCheck } from 'react-icons/fi';

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useTheme();
  const [notifications] = useState([
    { id: 1, title: 'Request Submitted', message: 'Your request #SR-00101 has been submitted.', time: '2 min ago', read: false },
    { id: 2, title: 'Request Assigned', message: 'Staff has been assigned to your request.', time: '1 hour ago', read: false },
    { id: 3, title: 'Work Completed', message: 'Your request has been marked as completed.', time: '3 hours ago', read: true },
  ]);

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    card: {
      background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '12px', padding: '16px', marginBottom: '10px',
      border: darkMode ? '1px solid #334155' : 'none', borderLeft: '4px solid #4f46e5',
    },
    cardTitle: { fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' },
    cardMsg: { fontSize: '14px', color: '#64748b' },
    cardTime: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  };

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}><FiBell style={{ marginRight: '8px' }} />Notifications</h2>
          {notifications.map((n) => (
            <div key={n.id} style={{ ...styles.card, opacity: n.read ? 0.6 : 1 }}>
              <div style={styles.cardTitle}>{n.title}</div>
              <div style={styles.cardMsg}>{n.message}</div>
              <div style={styles.cardTime}>{n.time}</div>
            </div>
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
