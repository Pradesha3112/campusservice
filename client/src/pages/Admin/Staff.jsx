import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FiPlus, FiTrash2, FiUserPlus, FiX } from 'react-icons/fi';
import api from '../../services/api';

const ManageStaff = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', phone: '', capacity: 5 });
  const { darkMode } = useTheme();

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff');
      setStaff(res.data.staff || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/create-staff', formData);
      setToast({ message: 'Staff created successfully!', type: 'success' });
      setFormData({ name: '', email: '', password: '', department: '', phone: '', capacity: 5 });
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create staff', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await api.delete(`/admin/staff/${id}`);
      setToast({ message: 'Staff deleted', type: 'success' });
      fetchStaff();
    } catch (err) {
      setToast({ message: 'Failed to delete staff', type: 'error' });
    }
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
    btn: (bg) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', background: bg, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }),
    table: { width: '100%', borderCollapse: 'collapse', background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', overflow: 'hidden' },
    th: { textAlign: 'left', padding: '12px', background: darkMode ? '#334155' : '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: '600' },
    td: { padding: '12px', borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9', fontSize: '13px', color: darkMode ? '#cbd5e1' : '#475569' },
    badge: (avl) => ({ background: avl ? '#10b981' : '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }),
    formCard: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '20px', marginTop: '20px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', backgroundColor: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b', outline: 'none', marginBottom: '12px' },
    row: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    field: { flex: '1 1 200px' },
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <div style={styles.header}>
            <h2 style={styles.title}>Manage Staff</h2>
            <button style={styles.btn('#4f46e5')} onClick={() => setShowForm(!showForm)}>
              {showForm ? <FiX /> : <FiUserPlus />} {showForm ? 'Cancel' : 'Add Staff'}
            </button>
          </div>

          {showForm && (
            <div style={styles.formCard}>
              <h3 style={{ marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Create New Staff Account</h3>
              <form onSubmit={handleCreate}>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <input style={styles.input} placeholder="Full Name *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div style={styles.field}>
                    <input style={styles.input} type="email" placeholder="Email *" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <input style={styles.input} type="password" placeholder="Password *" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                  </div>
                  <div style={styles.field}>
                    <input style={styles.input} placeholder="Department (e.g., Electrical)" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <input style={styles.input} type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div style={styles.field}>
                    <input style={styles.input} type="number" placeholder="Max Capacity" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 5 })} min="1" max="20" />
                  </div>
                </div>
                <button type="submit" style={styles.btn('#10b981')}><FiPlus /> Create Staff</button>
              </form>
            </div>
          )}

          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Workload</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s._id}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.department || '-'}</td>
                    <td style={styles.td}>{s.currentLoad}/{s.capacity}</td>
                    <td style={styles.td}><span style={styles.badge(s.availability)}>{s.availability ? 'Available' : 'Busy'}</span></td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(s._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ManageStaff;