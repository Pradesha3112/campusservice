import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { FiEye, FiCamera, FiCheck } from 'react-icons/fi';
import api from '../../services/api';
import Toast from '../../components/Toast';

const AssignedRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/staff/my-tasks');
      setTasks(res.data.requests || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStartWork = async (id, e) => {
    e.preventDefault();
    try {
      await api.put(`/staff/start-work/${id}`);
      setToast({ message: 'Work started!', type: 'success' });
      fetchTasks();
    } catch (err) { setToast({ message: 'Failed to start work', type: 'error' }); }
  };

  const handleComplete = async (id, e) => {
    e.preventDefault();
    try {
      await api.put(`/staff/complete-work/${id}`);
      setToast({ message: 'Work marked as complete!', type: 'success' });
      fetchTasks();
    } catch (err) { setToast({ message: 'Failed to complete', type: 'error' }); }
  };

  const getStatusColor = (s) => {
    const c = { Submitted: '#f59e0b', Assigned: '#8b5cf6', In_Progress: '#f97316', Waiting_Verification: '#14b8a6', Completed: '#10b981', Closed: '#10b981' };
    return c[s] || '#64748b';
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    card: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)' },
    badge: (bg) => ({ background: bg, color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }),
    btn: (bg) => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', background: bg, color: '#fff', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '8px' }),
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}>My Assigned Tasks</h2>
          {tasks.length === 0 ? <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No tasks assigned.</p> : tasks.map(t => (
            <div key={t._id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' }}>{t.requestId} - {t.serviceType}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{t.building}, Room {t.room} | {t.category}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Reporter: {t.studentId?.name || 'Unknown'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={styles.badge(getStatusColor(t.status))}>{t.status.replace('_', ' ')}</span>
                  {t.status === 'Assigned' && <button style={styles.btn('#f97316')} onClick={(e) => handleStartWork(t._id, e)}><FiCamera /> Start Work</button>}
                  {t.status === 'In_Progress' && <button style={styles.btn('#10b981')} onClick={(e) => handleComplete(t._id, e)}><FiCheck /> Complete</button>}
                  <Link to={`/staff/request/${t._id}`} style={{ color: '#4f46e5', fontSize: '18px' }}><FiEye /></Link>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AssignedRequests;
