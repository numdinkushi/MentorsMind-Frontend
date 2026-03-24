import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { Breadcrumbs } from './components/navigation/Breadcrumbs';
import { Footer } from './components/navigation/Footer';
import { ProtectedRoute } from './components/navigation/ProtectedRoute';
import { RoleBasedRoute } from './components/navigation/RoleBasedRoute';
import { ROUTES } from './config/routes.config';
import MentorDashboard from './pages/MentorDashboard';
import PaymentHistory from './pages/PaymentHistory';
import type { AuthState, User } from './types';

// Mock Auth State for demonstration
const MOCK_USER: User = {
  id: 'mentor-123',
  name: 'Alex Rivera',
  email: 'alex@mentorsmind.com',
  role: 'mentor',
  avatar: 'https://i.pravatar.cc/150?u=mentor-123',
  bio: 'Expert Blockchain Developer & Stellar Advocate'
};

const MOCK_AUTH: AuthState = {
  user: MOCK_USER,
  isAuthenticated: true,
  isLoading: false,
};

const App: React.FC = () => {
  const handleLogout = () => {
    console.log('Logging out...');
    // In a real app, this would clear tokens/context
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
        <Navbar auth={MOCK_AUTH} onLogout={handleLogout} />
        
        <main className="flex-1 flex flex-col">
          <Breadcrumbs />
          
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.LOGIN} element={<div className="p-20 text-center">Login Page Placeholder</div>} />
              <Route path={ROUTES.SIGNUP} element={<div className="p-20 text-center">Signup Page Placeholder</div>} />

              {/* Protected Routes */}
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute auth={MOCK_AUTH}>
                    <MentorDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path={ROUTES.PAYMENTS}
                element={
                  <ProtectedRoute auth={MOCK_AUTH}>
                    <PaymentHistory />
                  </ProtectedRoute>
                }
              />

              {/* Mentor-only Routes */}
              <Route
                path="/mentor/*"
                element={
                  <ProtectedRoute auth={MOCK_AUTH}>
                    <RoleBasedRoute auth={MOCK_AUTH} allowedRoles={['mentor', 'admin']}>
                      <div className="p-20 text-center text-2xl font-bold text-stellar">
                        Mentor Specific Routes Area
                      </div>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
