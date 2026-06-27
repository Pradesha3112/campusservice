import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      background: darkMode ? '#1e293b' : '#ffffff',
      borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    logo: {
      fontSize: '20px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#1e293b',
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      fontSize: '22px',
      cursor: 'pointer',
      color: darkMode ? '#94a3b8' : '#64748b',
      display: 'flex',
      alignItems: 'center',
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    iconBtn: {
      background: darkMode ? '#334155' : '#f1f5f9',
      border: 'none',
      borderRadius: '50%',
      width: '38px',
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      color: darkMode ? '#cbd5e1' : '#475569',
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: '-2px',
      right: '-2px',
      background: '#ef4444',
      color: '#fff',
      fontSize: '10px',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: darkMode ? '#f1f5f9' : '#1e293b',
    },
    userRole: {
      fontSize: '11px',
      color: '#64748b',
      textTransform: 'capitalize',
    },
    logoutBtn: {
      background: darkMode ? '#334155' : '#fee2e2',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 12px',
      cursor: 'pointer',
      color: '#ef4444',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <button style={styles.menuBtn} onClick={toggleSidebar} aria-label="Toggle menu">
          <FiMenu />
        </button>
        <span style={styles.logo}>🏫 Smart Campus</span>
      </div>
      <div style={styles.right}>
        <button style={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        <button style={styles.iconBtn} aria-label="Notifications">
          <FiBell />
          <span style={styles.badge}>3</span>
        </button>
        <div style={styles.userInfo}>
          <div style={{ textAlign: 'right' }}>
            <div style={styles.userName}>{user?.name || 'User'}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
          <div style={{ ...styles.iconBtn, background: '#4f46e5', color: '#fff' }}>
            <FiUser />
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;