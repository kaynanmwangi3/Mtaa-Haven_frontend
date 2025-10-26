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
import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

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
    <Routes>
      <Route path='/' element={<Bridge/>}>
        <Route index element={<Home/>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="properties" element={<Properties/>} />
        <Route path="about" element={<BriefAbout/>} />

      </Route>
    </Routes>
    <Footer/>
    </div>
  )
}

export default App
