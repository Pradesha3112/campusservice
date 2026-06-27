import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiUser, FiMail, FiLock, FiBook, FiPhone, FiSun, FiMoon, FiUserPlus,
  FiEye, FiEyeOff, FiCopy, FiCheck, FiAlertCircle,
} from 'react-icons/fi';
import Toast from '../components/Toast';
import PasswordStrength from '../components/PasswordStrength';

const DEPARTMENTS = ['IT', 'CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'AIDS', 'AIML', 'CYBER'];
const SECTIONS = ['A', 'B', 'C'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    registerNo: '', department: '', year: '', section: '', phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const { register } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'registerNo') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const handleBlur = (field) => setTouched({ ...touched, [field]: true });

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const specials = '!@#$%^&*()_+';
    const all = upper + lower + nums + specials;
    let pwd = upper[Math.floor(Math.random() * upper.length)] + lower[Math.floor(Math.random() * lower.length)] + nums[Math.floor(Math.random() * nums.length)] + specials[Math.floor(Math.random() * specials.length)];
    for (let i = 0; i < 8; i++) pwd += all[Math.floor(Math.random() * all.length)];
    const shuffled = pwd.split('').sort(() => 0.5 - Math.random()).join('');
    setFormData({ ...formData, password: shuffled, confirmPassword: shuffled });
  };

  const copyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const errors = useMemo(() => {
    const errs = {};
    if (touched.name && !formData.name.trim()) errs.name = 'Name is required';
    if (touched.email && !formData.email.trim()) errs.email = 'Email is required';
    else if (touched.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) errs.email = 'Invalid email format';
    if (touched.registerNo && formData.registerNo && formData.registerNo.length !== 10) errs.registerNo = 'Must be 10 digits';
    if (touched.phone && formData.phone && formData.phone.length !== 10) errs.phone = 'Must be 10 digits';
    if (touched.department && !formData.department) errs.department = 'Please select department';
    if (touched.section && !formData.section) errs.section = 'Please select section';
    if (touched.password && !formData.password) errs.password = 'Password is required';
    if (touched.confirmPassword && !formData.confirmPassword) errs.confirmPassword = 'Please confirm password';
    else if (touched.confirmPassword && formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }, [formData, touched]);

  const passwordStrength = useMemo(() => {
    const checks = { minLength: formData.password.length >= 8, hasUpper: /[A-Z]/.test(formData.password), hasLower: /[a-z]/.test(formData.password), hasNumber: /[0-9]/.test(formData.password), hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) };
    return Object.values(checks).filter(Boolean).length;
  }, [formData.password]);

  const isFormValid = () => formData.name.trim() && formData.email.trim() && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) && formData.password.length >= 8 && passwordStrength >= 4 && formData.password === formData.confirmPassword && formData.department && formData.section && (!formData.phone || formData.phone.length === 10) && (!formData.registerNo || formData.registerNo.length === 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true, department: true, section: true });
    if (!isFormValid()) return;
    try {
      await register(formData);
      setToast({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => navigate('/student/dashboard'), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    }
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputIconStyle = {
    position: 'absolute',
    left: '14px',
    color: '#94a3b8',
    fontSize: '17px',
    pointerEvents: 'none',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
  };

  const inputFieldStyle = (field) => {
    const isError = touched[field] && errors[field];
    const isValid = touched[field] && !errors[field] && formData[field];
    return {
      width: '100%',
      height: '46px',
      padding: '0 14px 0 42px',
      borderRadius: '10px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border 0.2s, box-shadow 0.2s',
      border: isError ? '2px solid #ef4444' : isValid ? '2px solid #10b981' : darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      boxShadow: isError ? '0 0 0 3px rgba(239,68,68,0.1)' : isValid ? '0 0 0 3px rgba(16,185,129,0.1)' : 'none',
      lineHeight: '46px',
    };
  };

  const selectStyle = (field) => ({
    ...inputFieldStyle(field),
    cursor: 'pointer',
    appearance: 'none',
    paddingRight: '36px',
  });

  const eyeBtnStyle = {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    fontSize: '17px',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    zIndex: 1,
  };

  const fieldStyle = { flex: '1 1 200px', marginBottom: '16px' };
  const labelStyle = { fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: darkMode ? '#cbd5e1' : '#475569' };
  const errorMsgStyle = { color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' };
  const successMsgStyle = { color: '#10b981', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      padding: '20px',
    }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button onClick={toggleTheme} aria-label="Toggle theme" style={{
        position: 'absolute', top: '20px', right: '20px', background: darkMode ? '#334155' : '#e2e8f0',
        border: 'none', borderRadius: '50%', width: '40px', height: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        fontSize: '18px', color: darkMode ? '#f59e0b' : '#6366f1',
      }}>{darkMode ? <FiSun /> : <FiMoon />}</button>

      <div style={{
        background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '36px',
        width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)',
        border: darkMode ? '1px solid #334155' : 'none',
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '4px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Join Smart Campus Service Portal</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={inputWrapperStyle}>
              <span style={inputIconStyle}><FiUser /></span>
              <input style={inputFieldStyle('name')} name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur('name')} />
            </div>
            {errors.name && <span style={errorMsgStyle}><FiAlertCircle />{errors.name}</span>}
            {touched.name && !errors.name && formData.name && <span style={successMsgStyle}><FiCheck />Valid</span>}
          </div>

          {/* Email */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={inputWrapperStyle}>
              <span style={inputIconStyle}><FiMail /></span>
              <input style={inputFieldStyle('email')} name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} />
            </div>
            {errors.email && <span style={errorMsgStyle}><FiAlertCircle />{errors.email}</span>}
            {touched.email && !errors.email && formData.email && <span style={successMsgStyle}><FiCheck />Valid</span>}
          </div>

          {/* Register No & Phone */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Register Number</label>
              <div style={inputWrapperStyle}>
                <span style={inputIconStyle}><FiBook /></span>
                <input style={inputFieldStyle('registerNo')} name="registerNo" type="text" placeholder="10-digit number" value={formData.registerNo} onChange={handleChange} onBlur={() => handleBlur('registerNo')} maxLength={10} inputMode="numeric" />
              </div>
              {errors.registerNo && <span style={errorMsgStyle}><FiAlertCircle />{errors.registerNo}</span>}
              {touched.registerNo && !errors.registerNo && formData.registerNo && formData.registerNo.length === 10 && <span style={successMsgStyle}><FiCheck />Valid</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Phone Number</label>
              <div style={inputWrapperStyle}>
                <span style={inputIconStyle}><FiPhone /></span>
                <input style={inputFieldStyle('phone')} name="phone" type="tel" placeholder="10-digit number" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} maxLength={10} inputMode="numeric" />
              </div>
              {errors.phone && <span style={errorMsgStyle}><FiAlertCircle />{errors.phone}</span>}
              {touched.phone && !errors.phone && formData.phone && formData.phone.length === 10 && <span style={successMsgStyle}><FiCheck />Valid</span>}
            </div>
          </div>

          {/* Department & Section */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Department <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={inputIconStyle}><FiBook /></span>
                <select style={selectStyle('department')} name="department" value={formData.department} onChange={handleChange} onBlur={() => handleBlur('department')}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {errors.department && <span style={errorMsgStyle}><FiAlertCircle />{errors.department}</span>}
              {touched.department && !errors.department && formData.department && <span style={successMsgStyle}><FiCheck />Selected</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Section <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={inputIconStyle}><FiBook /></span>
                <select style={selectStyle('section')} name="section" value={formData.section} onChange={handleChange} onBlur={() => handleBlur('section')}>
                  <option value="">Select Section</option>
                  {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              {errors.section && <span style={errorMsgStyle}><FiAlertCircle />{errors.section}</span>}
              {touched.section && !errors.section && formData.section && <span style={successMsgStyle}><FiCheck />Selected</span>}
            </div>
          </div>

          {/* Year */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Year</label>
            <div style={{ position: 'relative' }}>
              <span style={inputIconStyle}><FiBook /></span>
              <select style={selectStyle('year')} name="year" value={formData.year} onChange={handleChange}>
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Password <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={inputWrapperStyle}>
              <span style={inputIconStyle}><FiLock /></span>
              <input style={{ ...inputFieldStyle('password'), paddingRight: '44px' }} name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={handleChange} onBlur={() => handleBlur('password')} />
              <button type="button" style={eyeBtnStyle} onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span style={errorMsgStyle}><FiAlertCircle />{errors.password}</span>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button type="button" onClick={generatePassword} style={{ background: 'none', border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`, borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>🔑 Generate</button>
              {formData.password && (
                <button type="button" onClick={copyPassword} style={{ background: copied ? '#10b981' : 'none', border: `1px solid ${copied ? '#10b981' : darkMode ? '#475569' : '#e2e8f0'}`, borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', color: copied ? '#fff' : darkMode ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
                  {copied ? <><FiCheck />Copied</> : <><FiCopy />Copy</>}
                </button>
              )}
            </div>
            <PasswordStrength password={formData.password} />
          </div>

          {/* Confirm Password */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={inputWrapperStyle}>
              <span style={inputIconStyle}><FiLock /></span>
              <input style={{ ...inputFieldStyle('confirmPassword'), paddingRight: '44px' }} name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} onBlur={() => handleBlur('confirmPassword')} />
              <button type="button" style={eyeBtnStyle} onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle confirm password">
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && <span style={errorMsgStyle}><FiAlertCircle />{errors.confirmPassword}</span>}
            {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && <span style={successMsgStyle}><FiCheck />Passwords Match</span>}
          </div>

          {error && <div style={{ ...errorMsgStyle, textAlign: 'center', marginBottom: '8px', justifyContent: 'center' }}><FiAlertCircle />{error}</div>}

          <button type="submit" disabled={!isFormValid()} style={{
            width: '100%', height: '48px', borderRadius: '10px', border: 'none',
            backgroundColor: isFormValid() ? '#4f46e5' : '#94a3b8', color: '#ffffff',
            fontSize: '16px', fontWeight: '600', cursor: isFormValid() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            marginTop: '8px', transition: 'background 0.2s', opacity: isFormValid() ? 1 : 0.7,
          }}>
            <FiUserPlus /> Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;