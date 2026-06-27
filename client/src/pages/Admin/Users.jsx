import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import api from '../../services/api';

const ManageUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => { api.get('/admin/users').then(res => setUsers(res.data.users || [])).finally(() => setLoading(false)); }, []);

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    table: { width: '100%', borderCollapse: 'collapse', background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', overflow: 'hidden' },
    th: { textAlign: 'left', padding: '12px', background: darkMode ? '#334155' : '#f8fafc', color: '#64748b', fontSize: '13px' },
    td: { padding: '12px', borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9', fontSize: '13px', color: darkMode ? '#cbd5e1' : '#475569' },
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}>Manage Students</h2>
          <table style={styles.table}><thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Register No</th><th style={styles.th}>Dept</th><th style={styles.th}>Year</th></tr></thead>
            <tbody>{users.map(u => (
              <tr key={u._id}><td style={styles.td}>{u.name}</td><td style={styles.td}>{u.email}</td><td style={styles.td}>{u.registerNo || '-'}</td><td style={styles.td}>{u.department || '-'}</td><td style={styles.td}>{u.year || '-'}</td></tr>
            ))}</tbody>
          </table>
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default ManageUsers;
