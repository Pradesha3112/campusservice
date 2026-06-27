import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { FiStar } from 'react-icons/fi';

const RateService = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useTheme();
  const styles = { wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' }, body: { display: 'flex', flex: 1 }, main: { flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, card: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center' }, icon: { fontSize: '48px', color: '#f59e0b', marginBottom: '16px' }, title: { fontSize: '20px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' } };
  return <div style={styles.wrapper}><Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} /><div style={styles.body}><Sidebar open={sidebarOpen} /><main style={styles.main}><div style={styles.card}><FiStar style={styles.icon} /><h2 style={styles.title}>Rate Service</h2><p style={{ color: '#64748b' }}>Coming soon</p></div></main></div><Footer /></div>;
};
export default RateService;
