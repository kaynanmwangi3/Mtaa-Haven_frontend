import './App.css'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Bridge from './services/Bridge';
import LoginPage from './pages/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import Title from './components/Title.jsx';
import Footer from './components/Footer.jsx';
import Properties from './pages/Properties.jsx';
import BriefAbout from './pages/BriefAbout.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TenantDashboard from './pages/TenantDashboard.jsx';
import LandlordDashboard from './pages/LandlordDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import React, { Suspense } from 'react'
// Lazy load components for better performance
const LazyHome = React.lazy(() => import('./components/Home'));
const LazyProperties = React.lazy(() => import('./pages/Properties'));
// const LazyDashboard = React.lazy(() => import('./pages/Dashboard'));
const LazyTenantDashboard = React.lazy(() => import('./pages/TenantDashboard'));
const LazyLandlordDashboard = React.lazy(() => import('./pages/LandlordDashboard'));
const LazyProfile = React.lazy(() => import('./pages/Profile'));
const LazyBriefAbout = React.lazy(() => import('./pages/BriefAbout'));
const LazyLoginPage = React.lazy(() => import('./pages/LoginPage'));
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx';


const App = () => {

  return (
    <div>
    <Navbar/>
    <Title/>
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
      <Routes>
        <Route path='/' element={<Bridge/>}>
          <Route index element={<LazyHome/>} />
          <Route path="login" element={<LazyLoginPage />} />
          <Route path="properties" element={
            <ProtectedRoute>
              <LazyProperties/>
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <RoleProtectedRoute allowedRoles={['tenant','student']}>
              <LazyTenantDashboard/>
            </RoleProtectedRoute>
          } />
          <Route path="landlord-dashboard" element={
            <RoleProtectedRoute allowedRoles={['landlord']}>
              <LazyLandlordDashboard/>
            </RoleProtectedRoute>
          } />
          <Route path="about" element={<LazyBriefAbout/>} />
          <Route path="profile" element={
            <ProtectedRoute>
              <LazyProfile/>
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </Suspense>
    <Footer/>
    </div>
  )
}

export default App
