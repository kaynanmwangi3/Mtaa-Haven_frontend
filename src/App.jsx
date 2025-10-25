import './App.css'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Bridge from './services/Bridge';
import LoginPage from './pages/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import Title from './components/Title.jsx';
import Footer from './components/Footer.jsx';
import Properties from './pages/Properties.jsx';

function App() {

  return (
    <div>
    <Navbar/>
    <Title/>
    <Routes>
      <Route path='/' element={<Bridge/>}>
        <Route index element={<Home/>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="properties" element={<Properties/>} />

      </Route>
    </Routes>
    <Footer/>
    </div>
  )
}

export default App
