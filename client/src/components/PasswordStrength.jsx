import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const PasswordStrength = ({ password }) => {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;
  const strengthPercent = (passedCount / 5) * 100;

  const getStrengthLabel = () => {
    if (passedCount <= 2) return { text: 'Weak', color: '#ef4444' };
    if (passedCount <= 3) return { text: 'Medium', color: '#f59e0b' };
    if (passedCount <= 4) return { text: 'Strong', color: '#3b82f6' };
    return { text: 'Very Strong', color: '#10b981' };
  };

  const strength = getStrengthLabel();

  const checkItems = [
    { key: 'minLength', label: 'Minimum 8 characters' },
    { key: 'hasUpper', label: 'One uppercase letter' },
    { key: 'hasLower', label: 'One lowercase letter' },
    { key: 'hasNumber', label: 'One number' },
    { key: 'hasSpecial', label: 'One special character' },
  ];

  if (!password) return null;

  return (
    <div style={styles.container}>
      <div style={styles.progressBarBg}>
        <div
          style={{
            ...styles.progressBarFill,
            width: `${strengthPercent}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      <span style={{ ...styles.strengthLabel, color: strength.color }}>
        {strength.text}
      </span>
      <div style={styles.checkList}>
        {checkItems.map((item) => (
          <div key={item.key} style={styles.checkItem}>
            {checks[item.key] ? (
              <FiCheck style={{ color: '#10b981', fontSize: '14px' }} />
            ) : (
              <FiX style={{ color: '#ef4444', fontSize: '14px' }} />
            )}
            <span
              style={{
                ...styles.checkLabel,
                color: checks[item.key] ? '#10b981' : '#ef4444',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '8px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  progressBarBg: {
    width: '100%',
    height: '4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '2px',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease, background-color 0.3s ease',
  },
  strengthLabel: {
    fontSize: '13px',
    fontWeight: '600',
    display: 'block',
    marginBottom: '8px',
  },
  checkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkLabel: {
    fontSize: '12px',
  },
};

export default PasswordStrength;