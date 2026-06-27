import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiArrowRight, FiShield, FiTool, FiUsers } from 'react-icons/fi';

const Home = () => {
  const { darkMode, toggleTheme } = useTheme();

  const styles = {
    container: {
      minHeight: '100vh',
      background: darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
    },
    nav: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px 40px', maxWidth: '1200px', margin: '0 auto',
    },
    logo: { fontSize: '24px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b' },
    navBtns: { display: 'flex', gap: '12px', alignItems: 'center' },
    loginBtn: {
      padding: '10px 24px', borderRadius: '8px', border: 'none',
      backgroundColor: '#4f46e5', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
    },
    themeBtn: {
      background: darkMode ? '#334155' : '#e2e8f0', border: 'none', borderRadius: '50%',
      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: '18px', color: darkMode ? '#f59e0b' : '#6366f1',
    },
    hero: {
      textAlign: 'center', padding: '80px 20px', maxWidth: '800px', margin: '0 auto',
    },
    heroTitle: { fontSize: '48px', fontWeight: '800', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '16px', lineHeight: '1.2' },
    heroSub: { fontSize: '18px', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' },
    ctaBtn: {
      padding: '16px 40px', borderRadius: '12px', border: 'none',
      backgroundColor: '#4f46e5', color: '#fff', fontSize: '18px', fontWeight: '600',
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
    },
    features: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px', maxWidth: '1000px', margin: '0 auto', padding: '40px 20px',
    },
    featureCard: {
      background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '30px',
      textAlign: 'center', border: darkMode ? '1px solid #334155' : 'none',
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
    },
    featureIcon: { fontSize: '40px', marginBottom: '16px', color: '#4f46e5' },
    featureTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    featureDesc: { color: '#64748b', fontSize: '14px', lineHeight: '1.6' },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.logo}>🏫 Smart Campus</div>
        <div style={styles.navBtns}>
          <button style={styles.themeBtn} onClick={toggleTheme}>{darkMode ? <FiSun /> : <FiMoon />}</button>
          <Link to="/login"><button style={styles.loginBtn}>Sign In</button></Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Smart Campus<br />Service Request Portal</h1>
        <p style={styles.heroSub}>
          Report maintenance issues, track repairs, and keep your campus running smoothly.
          Fast, transparent, and efficient.
        </p>
        <Link to="/register">
          <button style={styles.ctaBtn}>Get Started <FiArrowRight /></button>
        </Link>
      </section>

      <section style={styles.features}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}><FiShield /></div>
          <h3 style={styles.featureTitle}>Easy Reporting</h3>
          <p style={styles.featureDesc}>Raise service requests in seconds with smart suggestions and QR code scanning.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}><FiTool /></div>
          <h3 style={styles.featureTitle}>Real-Time Tracking</h3>
          <p style={styles.featureDesc}>Track your request status from submission to completion with full transparency.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}><FiUsers /></div>
          <h3 style={styles.featureTitle}>Community Support</h3>
          <p style={styles.featureDesc}>Support existing requests to increase priority and get issues resolved faster.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;