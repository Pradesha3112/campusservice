import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FiUserPlus, FiSearch } from 'react-icons/fi';
import api from '../../services/api';

const AllRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const { darkMode } = useTheme();

  const fetchRequests = async () => {
    try {
      let url = '/admin/requests';
      const params = [];
      if (filterStatus) params.push(`status=${filterStatus}`);
      if (search) params.push(`search=${search}`);
      if (params.length) url += '?' + params.join('&');
      const res = await api.get(url);
      setRequests(res.data.requests || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff');
      setStaffList(res.data.staff || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRequests(); fetchStaff(); }, [filterStatus, search]);

  const handleAssign = async (id) => {
    if (!selectedStaff) {
      setToast({ message: 'Please select a staff member', type: 'error' });
      return;
    }
    try {
      await api.put(`/admin/assign/${id}`, { staffId: selectedStaff });
      setToast({ message: 'Staff assigned!', type: 'success' });
      setAssigningId(null);
      setSelectedStaff('');
      fetchRequests();
      fetchStaff();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to assign', type: 'error' });
    }
  };

  const getStatusColor = (s) => {
    const c = { Submitted: '#f59e0b', Verified: '#3b82f6', Assigned: '#8b5cf6', In_Progress: '#f97316', Waiting_Verification: '#14b8a6', Completed: '#10b981', Closed: '#10b981', Rejected: '#ef4444', Reopened: '#ec4899' };
    return c[s] || '#64748b';
  };

  const getPriorityColor = (p) => {
    const c = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
    return c[p] || '#64748b';
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    filters: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: '1 1 250px' },
    searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    searchInput: { width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '14px', outline: 'none' },
    select: { padding: '10px 14px', borderRadius: '10px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '14px', outline: 'none', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', overflow: 'hidden' },
    th: { textAlign: 'left', padding: '12px', background: darkMode ? '#334155' : '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: '600' },
    td: { padding: '12px', borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9', fontSize: '13px', color: darkMode ? '#cbd5e1' : '#475569' },
    badge: (bg) => ({ background: bg, color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-block' }),
    btn: (bg) => ({ padding: '6px 12px', borderRadius: '6px', border: 'none', background: bg, color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }),
    assignSelect: { padding: '6px 10px', borderRadius: '6px', border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0', background: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '12px', outline: 'none' },
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <h2 style={styles.title}>All Requests</h2>

          <div style={styles.filters}>
            <div style={styles.searchBox}>
              <FiSearch style={styles.searchIcon} />
              <input style={styles.searchInput} placeholder="Search by ID, room, description..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select style={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In_Progress">In Progress</option>
              <option value="Waiting_Verification">Waiting Verification</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Room</th>
                  <th style={styles.th}>Reporter</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Assigned Staff</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r._id}>
                    <td style={styles.td}><span style={{ color: '#4f46e5', fontWeight: '600' }}>{r.requestId}</span></td>
                    <td style={styles.td}>{r.category}</td>
                    <td style={styles.td}>{r.serviceType}</td>
                    <td style={styles.td}>{r.room}</td>
                    <td style={styles.td}>{r.studentId?.name || 'Unknown'}</td>
                    <td style={styles.td}><span style={styles.badge(getPriorityColor(r.priority))}>{r.priority}</span></td>
                    <td style={styles.td}><span style={styles.badge(getStatusColor(r.status))}>{r.status?.replace('_', ' ')}</span></td>
                    <td style={styles.td}>{r.assignedStaff?.name || '-'}</td>
                    <td style={styles.td}>
                      {(r.status === 'Verified' || r.status === 'Submitted' || r.status === 'Reopened') && !r.assignedStaff ? (
                        assigningId === r._id ? (
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <select style={styles.assignSelect} value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
                              <option value="">Select</option>
                              {staffList.filter(s => s.availability || s._id === r.assignedStaff?._id).map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.currentLoad}/{s.capacity})</option>
                              ))}
                            </select>
                            <button style={styles.btn('#10b981')} onClick={() => handleAssign(r._id)}>✓</button>
                            <button style={styles.btn('#ef4444')} onClick={() => setAssigningId(null)}>✕</button>
                          </div>
                        ) : (
                          <button style={styles.btn('#4f46e5')} onClick={() => setAssigningId(r._id)}>
                            <FiUserPlus /> Assign
                          </button>
                        )
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '12px' }}>
                          {r.assignedStaff ? 'Assigned' : r.status === 'Rejected' ? 'Rejected' : r.status === 'Closed' ? 'Done' : '-'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AllRequests;