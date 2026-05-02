import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom'; 
import logo from '../assets/logo.png';

function Navbar() {
  const [username, setUsername] = useState(null);
  const [showHi, setShowHi] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
    }

    const timer = setTimeout(() => {
      setShowHi(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="nav-logo-link">
          <img src={logo} alt="Sportiva Base Logo" className="logo-img" />
          <span className="brand-name">Sportiva Base</span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/explore-activities" className="nav-link">Explore Activities</Link>
      </div>

      <div className='navbar-auth'>
        {username ? (
          <div className="user-profile-nav">
            <span className="user-name-display">
              {showHi && "Hi, 👋 "}
              <strong>{username}</strong>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;