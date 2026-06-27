import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

const AdminProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    card: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '16px', padding: '30px', maxWidth: '500px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' },
    name: { fontSize: '22px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' },
    role: { fontSize: '14px', color: '#ef4444', fontWeight: '600', textTransform: 'capitalize', marginBottom: '20px' },
    info: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '14px' },
  };

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.avatar}><FiShield /></div>
            <h2 style={styles.name}>{user?.name || 'Admin'}</h2>
            <p style={styles.role}>Administrator</p>
            <div style={styles.info}><FiMail /> {user?.email}</div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default AdminProfile;
