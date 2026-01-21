import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ProductManager from './components/ProductManager';

function App() {
  return (
    <Router>
      <Routes>
        {/* דף נחיתה ללקוחות */}
        <Route path="/" element={<LandingPage />} />
        
        {/* דף ניהול מוצרים */}
        <Route path="/admin" element={<ProductManager />} />
      </Routes>
    </Router>
  );
}

export default App;
