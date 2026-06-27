import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiLock, FiSun, FiMoon, FiLogIn } from 'react-icons/fi';
import Toast from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(email, password);
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        if (res.user.role === 'admin') navigate('/admin/dashboard');
        else if (res.user.role === 'staff') navigate('/staff/dashboard');
        else navigate('/student/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setToast({ message: err.response?.data?.message || 'Login failed', type: 'error' });
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: darkMode
        ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      padding: '20px',
    },
    card: {
      background: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: darkMode
        ? '0 20px 60px rgba(0,0,0,0.5)'
        : '0 20px 60px rgba(0,0,0,0.1)',
      border: darkMode ? '1px solid #334155' : 'none',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '8px',
      color: darkMode ? '#f1f5f9' : '#1e293b',
    },
    subtitle: {
      textAlign: 'center',
      color: '#64748b',
      marginBottom: '30px',
      fontSize: '14px',
    },
    inputGroup: {
      marginBottom: '20px',
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      fontSize: '18px',
    },
    input: {
      width: '100%',
      padding: '14px 14px 14px 44px',
      borderRadius: '10px',
      border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      fontSize: '15px',
      outline: 'none',
      transition: 'border 0.2s',
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background 0.2s',
      marginTop: '10px',
    },
    errorText: {
      color: '#ef4444',
      textAlign: 'center',
      marginTop: '12px',
      fontSize: '14px',
    },
    linkText: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#64748b',
      fontSize: '14px',
    },
    themeBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: darkMode ? '#334155' : '#e2e8f0',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      color: darkMode ? '#f59e0b' : '#6366f1',
    },
  };

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button style={styles.themeBtn} onClick={toggleTheme}>
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to Smart Campus</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FiMail style={styles.icon} />
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <FiLock style={styles.icon} />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.button}>
            <FiLogIn /> Sign In
          </button>
        </form>
        <p style={styles.linkText}>
          Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;