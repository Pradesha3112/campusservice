import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { CATEGORIES, SUGGESTIONS } from '../../utils/constants';
import { FiSend, FiCamera, FiAlertCircle, FiCheck } from 'react-icons/fi';
import api from '../../services/api';

const RaiseRequest = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    category: '', serviceType: '', building: '', floor: '', room: '', description: '', isSensitive: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
    setDuplicate(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.category) errs.category = 'Please select a category';
    if (!formData.serviceType) errs.serviceType = 'Please select a service type';
    if (!formData.building.trim()) errs.building = 'Building is required';
    if (!formData.floor) errs.floor = 'Floor is required';
    if (!formData.room.trim()) errs.room = 'Room is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      if (image) form.append('image', image);

      const res = await api.post('/student/raise-request', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.isDuplicate) {
        setDuplicate(res.data.existingRequest);
        setToast({ message: 'A similar request already exists!', type: 'error' });
      } else {
        setToast({ message: 'Request raised successfully!', type: 'success' });
        setTimeout(() => navigate('/student/my-requests'), 1500);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to raise request', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSupportDuplicate = async () => {
    try {
      await api.put(`/student/support/${duplicate._id}`);
      setToast({ message: 'Request supported successfully!', type: 'success' });
      setTimeout(() => navigate('/student/my-requests'), 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to support request', type: 'error' });
    }
  };

  const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9' },
    body: { display: 'flex', flex: 1 },
    main: { flex: 1, padding: '24px' },
    formCard: {
      background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '28px',
      border: darkMode ? '1px solid #334155' : 'none',
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
      maxWidth: '700px',
    },
    title: { fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: darkMode ? '#f1f5f9' : '#1e293b' },
    row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
    field: { flex: '1 1 200px' },
    label: { fontSize: '13px', fontWeight: '600', marginBottom: '4px', display: 'block', color: darkMode ? '#cbd5e1' : '#475569' },
    required: { color: '#ef4444' },
    input: {
      width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none',
      border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b', transition: 'border 0.2s',
    },
    select: {
      width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none',
      border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b', cursor: 'pointer',
    },
    textarea: {
      width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '100px',
      border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#1e293b',
    },
    errorText: { color: '#ef4444', fontSize: '11px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' },
    button: {
      padding: '12px 32px', borderRadius: '10px', border: 'none', backgroundColor: '#4f46e5', color: '#fff',
      fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1,
    },
    imagePreview: { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: darkMode ? '2px solid #334155' : '2px solid #e2e8f0' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: darkMode ? '#cbd5e1' : '#475569' },
    duplicateBox: {
      background: darkMode ? '#312e81' : '#eef2ff', borderRadius: '12px', padding: '16px',
      border: '2px solid #4f46e5', marginBottom: '20px',
    },
  };

  return (
    <div style={styles.wrapper}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.body}>
        <Sidebar open={sidebarOpen} />
        <main style={styles.main}>
          <div style={styles.formCard}>
            <h2 style={styles.title}>Raise Service Request</h2>

            {duplicate && (
              <div style={styles.duplicateBox}>
                <p style={{ fontWeight: '600', color: darkMode ? '#c7d2fe' : '#3730a3', marginBottom: '8px' }}>
                  ⚠️ A similar request already exists!
                </p>
                <p style={{ fontSize: '14px', color: darkMode ? '#a5b4fc' : '#4f46e5' }}>
                  Request ID: {duplicate.requestId} | Status: {duplicate.status}
                </p>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Supported by {duplicate.supportCount} students
                </p>
                <button onClick={handleSupportDuplicate} style={{ ...styles.button, marginTop: '10px', backgroundColor: '#10b981' }}>
                  👍 Support This Request
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Category <span style={styles.required}>*</span></label>
                  <select style={styles.select} name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <span style={styles.errorText}><FiAlertCircle />{errors.category}</span>}
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Service Type <span style={styles.required}>*</span></label>
                  <select style={styles.select} name="serviceType" value={formData.serviceType} onChange={handleChange}>
                    <option value="">Select Service Type</option>
                    {formData.category && SUGGESTIONS[formData.category]?.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="Other">Other (specify in description)</option>
                  </select>
                  {errors.serviceType && <span style={styles.errorText}><FiAlertCircle />{errors.serviceType}</span>}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Building <span style={styles.required}>*</span></label>
                  <input style={styles.input} name="building" placeholder="e.g., Main Block" value={formData.building} onChange={handleChange} />
                  {errors.building && <span style={styles.errorText}><FiAlertCircle />{errors.building}</span>}
                </div>
                <div style={{ ...styles.field, flex: '0 0 100px' }}>
                  <label style={styles.label}>Floor <span style={styles.required}>*</span></label>
                  <input style={styles.input} name="floor" type="number" placeholder="e.g., 3" value={formData.floor} onChange={handleChange} />
                  {errors.floor && <span style={styles.errorText}><FiAlertCircle />{errors.floor}</span>}
                </div>
                <div style={{ ...styles.field, flex: '0 0 120px' }}>
                  <label style={styles.label}>Room <span style={styles.required}>*</span></label>
                  <input style={styles.input} name="room" placeholder="e.g., 302" value={formData.room} onChange={handleChange} />
                  {errors.room && <span style={styles.errorText}><FiAlertCircle />{errors.room}</span>}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Description <span style={styles.required}>*</span></label>
                <textarea style={styles.textarea} name="description" placeholder="Describe the issue in detail..." value={formData.description} onChange={handleChange} maxLength={500} />
                <span style={{ fontSize: '11px', color: '#64748b', textAlign: 'right', display: 'block' }}>{formData.description.length}/500</span>
                {errors.description && <span style={styles.errorText}><FiAlertCircle />{errors.description}</span>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Upload Image (optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{
                    padding: '10px 20px', borderRadius: '8px', border: darkMode ? '2px dashed #475569' : '2px dashed #cbd5e1',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: darkMode ? '#94a3b8' : '#64748b', fontSize: '14px',
                  }}>
                    <FiCamera /> Choose Image
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                  </label>
                  {image && <span style={{ fontSize: '13px', color: '#10b981' }}><FiCheck /> {image.name}</span>}
                </div>
                {preview && <img src={preview} alt="Preview" style={styles.imagePreview} />}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={styles.checkbox}>
                  <input type="checkbox" name="isSensitive" checked={formData.isSensitive} onChange={handleChange} />
                  Submit as Anonymous / Sensitive Request
                </label>
              </div>

              <button type="submit" style={styles.button} disabled={loading}>
                <FiSend /> {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RaiseRequest;