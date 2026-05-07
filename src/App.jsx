import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import TournamentsPage from './pages/TournamentsPage';
import EventsPage from './pages/EventsPage';
import CommunityPage from './pages/CommunityPage';
import './index.css';
import './pages/CommunityPage.css';

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/tournaments" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tournaments" replace />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="community" element={<CommunityPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
