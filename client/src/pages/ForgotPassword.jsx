import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiSun, FiMoon, FiSend } from 'react-icons/fi';
import axios from 'axios';
import Toast from '../components/Toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState(null);
  const { darkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setToast({ message: 'Reset link sent to your email!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Error sending reset link', type: 'error' });
    }
  };

  const styles = {
    container: {
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      padding: '20px',
    },
    card: {
      background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '40px',
      width: '100%', maxWidth: '420px',
      boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)',
      border: darkMode ? '1px solid #334155' : 'none',
    },
    title: { fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '24px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    inputGroup: { position: 'relative', marginBottom: '20px' },
    icon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    input: {
      width: '100%', padding: '14px 14px 14px 44px', borderRadius: '10px',
      border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '15px', outline: 'none',
    },
    button: {
      width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
      backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '16px', fontWeight: '600',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    },
    linkText: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' },
    themeBtn: {
      position: 'absolute', top: '20px', right: '20px', background: darkMode ? '#334155' : '#e2e8f0',
      border: 'none', borderRadius: '50%', width: '40px', height: '40px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      fontSize: '18px', color: darkMode ? '#f59e0b' : '#6366f1',
    },
  };

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button style={styles.themeBtn} onClick={toggleTheme}>{darkMode ? <FiSun /> : <FiMoon />}</button>
      <div style={styles.card}>
        <h1 style={styles.title}>Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FiMail style={styles.icon} />
            <input style={styles.input} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" style={styles.button}><FiSend /> Send Reset Link</button>
        </form>
        <p style={styles.linkText}>
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600' }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;