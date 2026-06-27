import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { FiInbox, FiMonitor, FiTool } from 'react-icons/fi';

const Inventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useTheme();
  const items = [
    { name: 'Benches', room: '302', condition: 'Good', lastRepair: 'Jan 2026' },
    { name: 'Projector', room: '101', condition: 'Needs Repair', lastRepair: 'Dec 2025' },
    { name: 'Fan', room: '204', condition: 'Working', lastRepair: 'Mar 2026' },
    { name: 'Computer', room: 'Lab 1', condition: 'Faulty', lastRepair: 'Feb 2026' },
  ];

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    table: { width: '100%', borderCollapse: 'collapse', background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', overflow: 'hidden' },
    th: { textAlign: 'left', padding: '12px', background: darkMode ? '#334155' : '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: '600' },
    td: { padding: '12px', borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9', fontSize: '13px', color: darkMode ? '#cbd5e1' : '#475569' },
    badge: (c) => ({ background: c === 'Good' || c === 'Working' ? '#10b981' : c === 'Needs Repair' ? '#f59e0b' : '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }),
  };

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}><FiInbox style={{ marginRight: '8px' }} />Inventory</h2>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Asset</th><th style={styles.th}>Room</th><th style={styles.th}>Condition</th><th style={styles.th}>Last Repair</th></tr></thead>
            <tbody>{items.map((item, i) => (
              <tr key={i}><td style={styles.td}><FiTool style={{ marginRight: '6px' }} />{item.name}</td><td style={styles.td}>{item.room}</td><td style={styles.td}><span style={styles.badge(item.condition)}>{item.condition}</span></td><td style={styles.td}>{item.lastRepair}</td></tr>
            ))}</tbody>
          </table>
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default Inventory;
