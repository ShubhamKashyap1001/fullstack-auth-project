import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import DashboardPage  from './pages/DashboardPage';
import UsersPage      from './pages/UsersPage';
import TeachersPage   from './pages/TeachersPage';
import AddTeacherPage from './pages/AddTeacherPage';

const AppLayout = ({ children }) => (
  <div className="page-wrapper">
    <Navbar />
    {children}
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout><DashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AppLayout><UsersPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <AppLayout><TeachersPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-teacher"
        element={
          <ProtectedRoute>
            <AppLayout><AddTeacherPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
