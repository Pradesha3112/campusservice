import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiGrid, FiPlusCircle, FiList, FiBell, FiUser, FiSettings,
  FiStar, FiPackage, FiEyeOff, FiCheckCircle, FiTool, FiBarChart2,
  FiUsers, FiClipboard, FiActivity, FiInbox,
} from 'react-icons/fi';

const Sidebar = ({ open }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();

  const studentLinks = [
    { path: '/student/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/student/raise-request', icon: <FiPlusCircle />, label: 'Raise Request' },
    { path: '/student/my-requests', icon: <FiList />, label: 'My Requests' },
    { path: '/student/notifications', icon: <FiBell />, label: 'Notifications' },
    { path: '/student/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const staffLinks = [
    { path: '/staff/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/staff/my-tasks', icon: <FiClipboard />, label: 'My Tasks' },
    { path: '/staff/notifications', icon: <FiBell />, label: 'Notifications' },
    { path: '/staff/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/admin/requests', icon: <FiList />, label: 'All Requests' },
    { path: '/admin/verify', icon: <FiCheckCircle />, label: 'Verify Requests' },
    { path: '/admin/staff', icon: <FiUsers />, label: 'Manage Staff' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Manage Users' },
    { path: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    { path: '/admin/audit-logs', icon: <FiActivity />, label: 'Audit Logs' },
    { path: '/admin/inventory', icon: <FiInbox />, label: 'Inventory' },
    { path: '/admin/notifications', icon: <FiBell />, label: 'Notifications' },
    { path: '/admin/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'staff' ? staffLinks : studentLinks;

  const isActive = (path) => location.pathname === path;

  const styles = {
    sidebar: {
      width: open ? '250px' : '0px',
      minHeight: 'calc(100vh - 64px)',
      background: darkMode ? '#0f172a' : '#ffffff',
      borderRight: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      paddingTop: '16px',
      position: 'sticky',
      top: '64px',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      color: darkMode ? '#94a3b8' : '#64748b',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: 'none',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      borderLeft: '3px solid transparent',
    },
    activeLink: {
      background: darkMode ? '#1e293b' : '#eff6ff',
      color: '#4f46e5',
      borderLeft: '3px solid #4f46e5',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.sidebar}>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            ...styles.link,
            ...(isActive(link.path) ? styles.activeLink : {}),
          }}
        >
          <span style={{ fontSize: '18px' }}>{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;