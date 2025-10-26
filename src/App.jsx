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
import ProtectedRoute from './components/ProtectedRoute.jsx';
import React, { Suspense } from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

// Lazy load components for better performance
const LazyHome = React.lazy(() => import('./components/Home'));
const LazyProperties = React.lazy(() => import('./pages/Properties'));
const LazyDashboard = React.lazy(() => import('./pages/Dashboard'));
const LazyProfile = React.lazy(() => import('./pages/Profile'));
const LazyBriefAbout = React.lazy(() => import('./pages/BriefAbout'));
const LazyLoginPage = React.lazy(() => import('./pages/LoginPage'));

const App = () => {
  const cld = new Cloudinary({ cloud: { cloudName: 'djtahjahe' } });

  // Use this sample image or upload your own via the Media Library
  const img = cld
        .image('cld-sample-5')
        .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

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
            <ProtectedRoute>
              <LazyDashboard/>
            </ProtectedRoute>
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
