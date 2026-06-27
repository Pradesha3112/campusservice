import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FiArrowLeft, FiStar, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';

const RequestDetails = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [toast, setToast] = useState(null);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => { api.get(`/student/request/${id}`).then(res => setRequest(res.data.request)).finally(() => setLoading(false)); }, [id]);

  const handleVerify = async (satisfied) => {
    try {
      await api.put(`/student/verify/${id}`, { satisfied, rating, feedback });
      setToast({ message: satisfied ? 'Thank you for your feedback!' : 'Request reopened.', type: 'success' });
      setTimeout(() => navigate('/student/my-requests'), 1500);
    } catch (err) { setToast({ message: 'Action failed', type: 'error' }); }
  };

  const getStatusColor = (s) => {
    const c = { Submitted: '#f59e0b', Verified: '#3b82f6', Assigned: '#8b5cf6', In_Progress: '#f97316', Waiting_Verification: '#14b8a6', Completed: '#10b981', Closed: '#10b981', Rejected: '#ef4444', Reopened: '#ec4899' };
    return c[s] || '#64748b';
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    card: { background: darkMode ? '#1e293b' : '#fff', borderRadius: '16px', padding: '24px', border: darkMode ? '1px solid #334155' : 'none', boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '700px' },
    badge: (bg) => ({ background: bg, color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-block' }),
    btn: (bg) => ({ padding: '12px 24px', borderRadius: '10px', border: 'none', background: bg, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', marginRight: '12px' }),
  };

  if (loading) return <Loader />;
  if (!request) return <div style={styles.wrapper}><Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} /><div style={styles.body}><Sidebar open={sidebarOpen} /><main style={styles.main}><p>Request not found</p></main></div></div>;

  return (
    <div style={styles.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '14px' }}><FiArrowLeft /> Back</button>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>{request.requestId}</h2>
              <span style={styles.badge(getStatusColor(request.status))}>{request.status?.replace('_', ' ')}</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Category</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{request.category} - {request.serviceType}</p>
            </div>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div><p style={{ fontSize: '13px', color: '#64748b' }}>Location</p><p style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{request.building}, Floor {request.floor}, Room {request.room}</p></div>
              <div><p style={{ fontSize: '13px', color: '#64748b' }}>Priority</p><p style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{request.priority}</p></div>
              <div><p style={{ fontSize: '13px', color: '#64748b' }}>Supporters</p><p style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{request.supportCount} students</p></div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Description</p>
              <p style={{ color: darkMode ? '#cbd5e1' : '#475569', lineHeight: '1.6' }}>{request.description}</p>
            </div>
            {request.assignedStaff && <div style={{ marginBottom: '20px' }}><p style={{ fontSize: '13px', color: '#64748b' }}>Assigned Staff</p><p style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{request.assignedStaff.name}</p></div>}

            {request.status === 'Waiting_Verification' && (
              <div style={{ borderTop: darkMode ? '1px solid #334155' : '1px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
                <h3 style={{ marginBottom: '12px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Verify Completion</h3>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Rating</p>
                  {[1, 2, 3, 4, 5].map(s => <FiStar key={s} onClick={() => setRating(s)} style={{ cursor: 'pointer', fontSize: '24px', color: s <= rating ? '#f59e0b' : '#cbd5e1', marginRight: '4px' }} />)}
                </div>
                <textarea style={{ width: '100%', padding: '10px', borderRadius: '8px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', background: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b', resize: 'vertical', minHeight: '80px', marginBottom: '12px', fontSize: '14px' }} placeholder="Feedback (optional)" value={feedback} onChange={e => setFeedback(e.target.value)} />
                <button style={styles.btn('#10b981')} onClick={() => handleVerify(true)}>✅ Accept & Close</button>
                <button style={styles.btn('#ef4444')} onClick={() => handleVerify(false)}><FiRefreshCw /> Reopen Request</button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default RequestDetails;
