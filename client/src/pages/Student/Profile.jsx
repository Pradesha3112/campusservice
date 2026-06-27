import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { FiUser, FiMail, FiBook, FiPhone, FiEdit2, FiSave, FiX, FiLock } from 'react-icons/fi';
import api from '../../services/api';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: '', email: '' });
  const [toast, setToast] = useState(null);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const startEditing = () => {
    setFormData({ phone: user?.phone || '', email: user?.email || '' });
    setEditing(true);
  };

  const cancelEditing = () => setEditing(false);

  const saveProfile = async () => {
    try {
      await api.put('/student/profile', { phone: formData.phone, email: formData.email });
      setToast({ message: 'Profile updated!', type: 'success' });
      setEditing(false);
    } catch (err) {
      setToast({ message: 'Failed to update profile', type: 'error' });
    }
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    card: { background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '30px', maxWidth: '550px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' },
    name: { fontSize: '22px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' },
    role: { fontSize: '14px', color: '#4f46e5', fontWeight: '600', textTransform: 'capitalize', marginBottom: '24px' },
    fieldRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '14px' },
    fieldIcon: { fontSize: '18px', color: '#94a3b8', minWidth: '20px' },
    fieldLabel: { fontWeight: '600', minWidth: '100px', color: darkMode ? '#94a3b8' : '#64748b', fontSize: '13px' },
    fieldValue: { flex: 1 },
    readOnly: { fontSize: '13px', color: '#94a3b8', marginLeft: '8px', fontStyle: 'italic' },
    editInput: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', backgroundColor: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '14px', outline: 'none' },
    btn: (bg) => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', background: bg, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginRight: '8px' }),
    outlineBtn: { padding: '8px 16px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: darkMode ? '#94a3b8' : '#64748b' },
  };

  return (
    <div style={styles.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.avatar}><FiUser /></div>
            <h2 style={styles.name}>{user?.name || 'Student'}</h2>
            <p style={styles.role}>{user?.role}</p>

            {/* Read-Only Fields */}
            <div style={styles.fieldRow}>
              <FiUser style={styles.fieldIcon} />
              <span style={styles.fieldLabel}>Name</span>
              <span style={styles.fieldValue}>{user?.name}<span style={styles.readOnly}>🔒</span></span>
            </div>
            <div style={styles.fieldRow}>
              <FiBook style={styles.fieldIcon} />
              <span style={styles.fieldLabel}>Register No</span>
              <span style={styles.fieldValue}>{user?.registerNo || 'N/A'}<span style={styles.readOnly}>🔒</span></span>
            </div>
            <div style={styles.fieldRow}>
              <FiBook style={styles.fieldIcon} />
              <span style={styles.fieldLabel}>Department</span>
              <span style={styles.fieldValue}>{user?.department || 'N/A'}<span style={styles.readOnly}>🔒</span></span>
            </div>
            <div style={styles.fieldRow}>
              <FiBook style={styles.fieldIcon} />
              <span style={styles.fieldLabel}>Section</span>
              <span style={styles.fieldValue}>{user?.section || 'N/A'}<span style={styles.readOnly}>🔒</span></span>
            </div>
            <div style={styles.fieldRow}>
              <FiBook style={styles.fieldIcon} />
              <span style={styles.fieldLabel}>Year</span>
              <span style={styles.fieldValue}>{user?.year || 'N/A'}<span style={styles.readOnly}>🔒</span></span>
            </div>

            {/* Editable Fields */}
            <div style={styles.fieldRow}>
              <FiMail style={styles.fieldIcon} />
              <span style={styles.fieldLabel}>Email</span>
              {editing ? (
                <input style={styles.editInput} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              ) : (
                <span style={styles.fieldValue}>{user?.email}</span>
              )}
            </div>
            <div style={styles.fieldRow}>
              <FiPhone style={styles.fieldIcon} />
              <span style={styles.fieldLabel}>Phone</span>
              {editing ? (
                <input style={styles.editInput} type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} maxLength={10} />
              ) : (
                <span style={styles.fieldValue}>{user?.phone || 'Not provided'}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '20px' }}>
              {editing ? (
                <>
                  <button style={styles.btn('#10b981')} onClick={saveProfile}><FiSave /> Save Changes</button>
                  <button style={styles.outlineBtn} onClick={cancelEditing}><FiX /> Cancel</button>
                </>
              ) : (
                <button style={styles.btn('#4f46e5')} onClick={startEditing}><FiEdit2 /> Edit Profile</button>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;