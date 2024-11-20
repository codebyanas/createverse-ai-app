import './App.css';
import React, { useEffect } from 'react';
import Home from './components/Home';
import Navbar from './components/Navbar';
import PdfGenerator from './components/PdfGenerator';
import IconGenerator from './components/IconGenerator';
import ImageGenerator from './components/ImageGenerator';
import BackgroundRemover from './components/BackgroundRemover';
import BackgroundGenerator from './components/BackgroundGenerator';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = 'Home | EditPro Studio';
        break;
      case '/home':
        document.title = 'Home | EditPro Studio';
        break;
      case '/image-generator':
        document.title = 'Image Generator | EditPro Studio';
        break;
      case '/icon-generator':
        document.title = 'Icon Generator | EditPro Studio';
        break;
      case '/pdf-generator':
        document.title = 'PDF Generator | EditPro Studio';
        break;
      case '/background-generator':
        document.title = 'Background Generator | EditPro Studio';
        break;
      case '/background-remover':
        document.title = 'Background Remover | EditPro Studio';
        break;
        document.title = 'News Headlines | EditPro Studio';
        break;
      default:
        document.title = 'Default Title | EditPro Studio';
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/image-generator" element={<ImageGenerator />} />
        <Route exact path="/icon-generator" element={<IconGenerator />} />
        <Route exact path="/pdf-generator" element={<PdfGenerator />} />
        <Route exact path="/background-generator" element={<BackgroundGenerator />} />
        <Route exact path="/background-remover" element={<BackgroundRemover />} />
      </Routes>
    </>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;

