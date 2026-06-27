import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();

  const styles = {
    footer: {
      textAlign: 'center',
      padding: '16px',
      color: '#64748b',
      fontSize: '13px',
      borderTop: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      marginTop: 'auto',
    },
  };

  return (
    <footer style={styles.footer}>
      © 2026 Smart Campus Service Portal. All rights reserved.
    </footer>
  );
};

export default Footer;