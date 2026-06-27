import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/Student/Dashboard';
import RaiseRequest from './pages/Student/RaiseRequest';
import RequestHistory from './pages/Student/RequestHistory';
import RequestDetails from './pages/Student/RequestDetails';
import StudentNotifications from './pages/Student/Notifications';
import StudentProfile from './pages/Student/Profile';
import RateService from './pages/Student/RateService';
import LostFound from './pages/Student/LostFound';
import AnonymousRequest from './pages/Student/AnonymousRequest';
import StaffDashboard from './pages/Staff/Dashboard';
import StaffTasks from './pages/Staff/AssignedRequests';
import StaffNotifications from './pages/Staff/Notifications';
import StaffProfile from './pages/Staff/Profile';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminRequests from './pages/Admin/AllRequests';
import AdminVerify from './pages/Admin/VerifyRequests';
import AdminStaff from './pages/Admin/Staff';
import AdminUsers from './pages/Admin/Users';
import AdminAnalytics from './pages/Admin/Analytics';
import AdminAuditLogs from './pages/Admin/AuditLogs';
import AdminInventory from './pages/Admin/Inventory';
import AdminNotifications from './pages/Admin/Notifications';
import AdminProfile from './pages/Admin/Profile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/student/dashboard" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/raise-request" element={<PrivateRoute roles={['student']}><RaiseRequest /></PrivateRoute>} />
          <Route path="/student/my-requests" element={<PrivateRoute roles={['student']}><RequestHistory /></PrivateRoute>} />
          <Route path="/student/request/:id" element={<PrivateRoute roles={['student']}><RequestDetails /></PrivateRoute>} />
          <Route path="/student/notifications" element={<PrivateRoute roles={['student']}><StudentNotifications /></PrivateRoute>} />
          <Route path="/student/profile" element={<PrivateRoute roles={['student']}><StudentProfile /></PrivateRoute>} />
          <Route path="/student/rate-service" element={<PrivateRoute roles={['student']}><RateService /></PrivateRoute>} />
          <Route path="/student/lost-found" element={<PrivateRoute roles={['student']}><LostFound /></PrivateRoute>} />
          <Route path="/student/anonymous" element={<PrivateRoute roles={['student']}><AnonymousRequest /></PrivateRoute>} />
          <Route path="/staff/dashboard" element={<PrivateRoute roles={['staff']}><StaffDashboard /></PrivateRoute>} />
          <Route path="/staff/my-tasks" element={<PrivateRoute roles={['staff']}><StaffTasks /></PrivateRoute>} />
          <Route path="/staff/notifications" element={<PrivateRoute roles={['staff']}><StaffNotifications /></PrivateRoute>} />
          <Route path="/staff/profile" element={<PrivateRoute roles={['staff']}><StaffProfile /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/requests" element={<PrivateRoute roles={['admin']}><AdminRequests /></PrivateRoute>} />
          <Route path="/admin/verify" element={<PrivateRoute roles={['admin']}><AdminVerify /></PrivateRoute>} />
          <Route path="/admin/staff" element={<PrivateRoute roles={['admin']}><AdminStaff /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute roles={['admin']}><AdminAnalytics /></PrivateRoute>} />
          <Route path="/admin/audit-logs" element={<PrivateRoute roles={['admin']}><AdminAuditLogs /></PrivateRoute>} />
          <Route path="/admin/inventory" element={<PrivateRoute roles={['admin']}><AdminInventory /></PrivateRoute>} />
          <Route path="/admin/notifications" element={<PrivateRoute roles={['admin']}><AdminNotifications /></PrivateRoute>} />
          <Route path="/admin/profile" element={<PrivateRoute roles={['admin']}><AdminProfile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;