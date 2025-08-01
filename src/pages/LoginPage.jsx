// LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.msg || 'An error occurred'}`);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-4 opacity-60">
        <img src="/Godfather.jpg" alt="background" className="w-full h-full object-cover" />
        <img src="/Seven.jpg" alt="background" className="w-full h-full object-cover" />
        <img src="/The_Batman.jpeg" alt="background" className="w-full h-full object-cover" />
        <img src="/image4.jpg" alt="background" className="w-full h-full object-cover" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-300 to-primary opacity-80"></div>

      {/* Login Form */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-200/80 backdrop-blur-xl shadow-xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <img src="/MainLogo.png" alt="Moodboard Logo" className="h-28 mx-auto" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="link link-primary">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;