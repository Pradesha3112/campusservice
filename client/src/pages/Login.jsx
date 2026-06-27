import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiLock, FiSun, FiMoon, FiLogIn, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';
import Toast from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    if (name === 'email' && !value.trim()) return 'Email is required';
    if (name === 'email' && value && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) return 'Invalid email format';
    if (name === 'password' && !value) return 'Password is required';
    return '';
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const val = field === 'email' ? email : password;
    setFieldErrors({ ...fieldErrors, [field]: validateField(field, val) });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
    if (touched.email) setFieldErrors({ ...fieldErrors, email: validateField('email', e.target.value) });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
    if (touched.password) setFieldErrors({ ...fieldErrors, password: validateField('password', e.target.value) });
  };

  const isFormValid = () => email.trim() && password.trim() && !fieldErrors.email && !fieldErrors.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);
    setFieldErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;
    try {
      const res = await login(email, password);
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        if (res.user.role === 'admin') navigate('/admin/dashboard');
        else if (res.user.role === 'staff') navigate('/staff/dashboard');
        else navigate('/student/dashboard');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid Email or Password';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    }
  };

  const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
  const iconStyle = { position: 'absolute', left: '14px', color: '#94a3b8', fontSize: '17px', pointerEvents: 'none', zIndex: 1 };
  const inputStyle = (field) => {
    const isError = touched[field] && fieldErrors[field];
    const isValid = touched[field] && !fieldErrors[field] && (field === 'email' ? email : password);
    return {
      width: '100%', height: '48px', padding: '0 14px 0 44px', borderRadius: '10px', fontSize: '15px', outline: 'none',
      transition: 'border 0.2s, box-shadow 0.2s',
      border: isError ? '2px solid #ef4444' : isValid ? '2px solid #10b981' : darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b',
      boxShadow: isError ? '0 0 0 3px rgba(239,68,68,0.1)' : isValid ? '0 0 0 3px rgba(16,185,129,0.1)' : 'none',
      lineHeight: '48px',
    };
  };
  const eyeStyle = { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '17px', display: 'flex', alignItems: 'center', padding: 0, zIndex: 1 };
  const fieldStyle = { marginBottom: '20px' };
  const labelStyle = { fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block', color: darkMode ? '#cbd5e1' : '#475569' };
  const errStyle = { color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' };
  const okStyle = { color: '#10b981', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', padding: '20px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button onClick={toggleTheme} aria-label="Toggle theme" style={{ position: 'absolute', top: '20px', right: '20px', background: darkMode ? '#334155' : '#e2e8f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', color: darkMode ? '#f59e0b' : '#6366f1' }}>{darkMode ? <FiSun /> : <FiMoon />}</button>
      <div style={{ background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)', border: darkMode ? '1px solid #334155' : 'none' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '14px' }}>Sign in to Smart Campus</p>
        <form onSubmit={handleSubmit} noValidate>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapperStyle}>
              <span style={iconStyle}><FiMail /></span>
              <input style={{ ...inputStyle('email'), paddingRight: '14px' }} type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} onBlur={() => handleBlur('email')} />
            </div>
            {fieldErrors.email && <span style={errStyle}><FiAlertCircle />{fieldErrors.email}</span>}
            {touched.email && !fieldErrors.email && email && <span style={okStyle}><FiCheck />Valid</span>}
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <div style={inputWrapperStyle}>
              <span style={iconStyle}><FiLock /></span>
              <input style={{ ...inputStyle('password'), paddingRight: '44px' }} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={handlePasswordChange} onBlur={() => handleBlur('password')} />
              <button type="button" style={eyeStyle} onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
            </div>
            {fieldErrors.password && <span style={errStyle}><FiAlertCircle />{fieldErrors.password}</span>}
          </div>
          {error && <div style={{ ...errStyle, textAlign: 'center', justifyContent: 'center', marginBottom: '8px' }}><FiAlertCircle />{error}</div>}
          <button type="submit" disabled={!isFormValid()} style={{ width: '100%', height: '48px', borderRadius: '10px', border: 'none', backgroundColor: isFormValid() ? '#4f46e5' : '#94a3b8', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: isFormValid() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px', opacity: isFormValid() ? 1 : 0.7, transition: 'background 0.2s' }}><FiLogIn />Sign In</button>
        </form>
        <div style={{ textAlign: 'right', marginTop: '12px' }}><Link to="/forgot-password" style={{ fontSize: '13px', color: '#4f46e5' }}>Forgot Password?</Link></div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }}>Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: '600' }}>Create Account</Link></p>
      </div>
    </div>
  );
};

export default Login;