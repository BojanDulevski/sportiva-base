import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';


function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setReviewError(data.username || data.email || "An error occurred during registration.");
      }
    } catch (error) {
      setReviewError("Server connection failed. Please ensure the backend is running.");
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Join Sportiva Base</h2>
        <p>Create your profile and start your fitness journey.</p>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', fontSize: '14px'}}>{reviewError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="********"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <button type="submit" className="auth-submit-btn">Register</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;