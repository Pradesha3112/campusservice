import React from 'react';

const Loader = () => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #4f46e5',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={styles.spinner}></div>
    </div>
  );
};

export default Loader;