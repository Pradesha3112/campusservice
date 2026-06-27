import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiUser, FiMail, FiLock, FiBook, FiPhone, FiSun, FiMoon, FiUserPlus } from 'react-icons/fi';
import Toast from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    registerNo: '',
    department: '',
    year: '',
    section: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const { register } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await register(formData);
      setToast({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => navigate('/student/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setToast({ message: err.response?.data?.message || 'Registration failed', type: 'error' });
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
      maxWidth: '480px',
      boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)',
      border: darkMode ? '1px solid #334155' : 'none',
    },
    title: { fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' },
    row: { display: 'flex', gap: '12px', marginBottom: '16px' },
    inputGroup: { flex: 1, position: 'relative', marginBottom: '16px' },
    icon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    input: {
      width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px',
      border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '14px', outline: 'none',
    },
    select: {
      width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px',
      border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '14px', outline: 'none',
      cursor: 'pointer',
    },
    button: {
      width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
      backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '16px', fontWeight: '600',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '8px', marginTop: '8px',
    },
    errorText: { color: '#ef4444', textAlign: 'center', marginTop: '8px', fontSize: '14px' },
    linkText: { textAlign: 'center', marginTop: '16px', color: '#64748b', fontSize: '14px' },
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
      <button style={styles.themeBtn} onClick={toggleTheme}>
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join Smart Campus Service Portal</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FiUser style={styles.icon} />
            <input style={styles.input} name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <FiMail style={styles.icon} />
            <input style={styles.input} name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
          </div>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <FiLock style={styles.icon} />
              <input style={styles.input} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <FiLock style={styles.icon} />
              <input style={styles.input} name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <FiBook style={styles.icon} />
            <input style={styles.input} name="registerNo" type="text" placeholder="Register Number" value={formData.registerNo} onChange={handleChange} />
          </div>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <FiBook style={styles.icon} />
              <input style={styles.input} name="department" type="text" placeholder="Department" value={formData.department} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <FiBook style={styles.icon} />
              <select style={styles.select} name="year" value={formData.year} onChange={handleChange}>
                <option value="">Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <FiBook style={styles.icon} />
              <input style={styles.input} name="section" type="text" placeholder="Section" value={formData.section} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <FiPhone style={styles.icon} />
              <input style={styles.input} name="phone" type="text" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.button}>
            <FiUserPlus /> Register
          </button>
        </form>
        <p style={styles.linkText}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;