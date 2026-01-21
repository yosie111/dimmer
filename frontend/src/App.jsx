import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import ProductManager from './components/ProductManager';
import LeadsManager from './components/LeadsManager';
import Dashboard from './components/Dashboard';


// Navigation Component
const Navigation = () => {
  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.container}>
        <Link to="/" style={navStyles.logo}>Dimmer</Link>
        <div style={navStyles.links}>
          <Link to="/" style={navStyles.link}>דף הבית</Link>
          <Link to="/dashboard" style={navStyles.link}>דשבורד</Link>
          <Link to="/leads" style={navStyles.link}>ניהול לידים</Link>
          <Link to="/admin" style={navStyles.link}>ניהול מוצרים</Link>
        </div>
      </div>
    </nav>
  );
};

const navStyles = {
  nav: {
    backgroundColor: '#1f2937',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    direction: 'rtl'
  },
  logo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding:'5%'

  },
  links: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s'
  }
};

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        {/* דף נחיתה ללקוחות */}
        <Route path="/" element={<LandingPage />} />
        
        {/* דשבורד */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* ניהול לידים */}
        <Route path="/leads" element={<LeadsManager />} />
        
        {/* דף ניהול מוצרים */}
        <Route path="/admin" element={<ProductManager />} />
      </Routes>
    </Router>
  );
}

export default App;
