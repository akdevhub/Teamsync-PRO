import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingState from './components/common/LoadingState';

// Lazy loaded routes for performance
const Login = lazy(() => import('./features/auth/Login'));
const Signup = lazy(() => import('./features/auth/Signup'));
const DashboardOverview = lazy(() => import('./features/dashboard/DashboardOverview'));
const ProjectsList = lazy(() => import('./features/projects/ProjectsList'));
const TasksList = lazy(() => import('./features/tasks/TasksList'));
const AnalyticsView = lazy(() => import('./features/analytics/AnalyticsView'));
const UserProfile = lazy(() => import('./features/profile/UserProfile'));
const NotesList = lazy(() => import('./features/notes/NotesList'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><LoadingState message="Loading application..." /></div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes Wrapper */}
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardOverview />} />
                  <Route path="/projects" element={<ProjectsList />} />
                  <Route path="/tasks" element={<TasksList />} />
                  <Route path="/notes" element={<NotesList />} />
                  <Route path="/analytics" element={<AnalyticsView />} />
                  <Route path="/profile" element={<UserProfile />} />
                </Route>

                {/* Redirect root to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
