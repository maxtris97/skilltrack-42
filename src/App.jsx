import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import DashboardPage from './pages/DashboardPage';
import PlannerPage from './pages/PlannerPage';
import TopicsPage from './pages/TopicsPage';
import DsaPage from './pages/DsaPage';
import NotesPage from './pages/NotesPage';
import StudyTimePage from './pages/StudyTimePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Authentication Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Dashboard Layout and Sub-routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/dsa" element={<DsaPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/study-time" element={<StudyTimePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
