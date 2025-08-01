import axios from 'axios';
import React, { useState,useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';

const RegisterPage=()=>{
    const [formData,setFormData]=useState({
        username:'',
        email:'',
        password:'',
    });

const [errors, setErrors] = useState({});
// Add this useEffect hook
useEffect(() => {
  const newErrors = {};
  if (formData.username && formData.username.length < 3) {
    newErrors.username = 'Username must be at least 3 characters';
  }
  if (formData.password && formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }
  setErrors(newErrors);
}, [formData]); // The dependency array makes this run whenever formData changes


const handleChange=(e)=>
{
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    });
};
const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    try{
        const response= await axios.post('http://localhost:5000/api/auth/register',formData)
        console.log('Form data submitted:', response.data);
        alert('registration successfull');
        Navigate('/login');
    }
    catch(error){
        console.error('There was an error registering!',error.response.data);
        alert(`registration failed: ${error.response.data.msg} `);
    }
};

  return (
    <div className="min-h-screen relative">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-4 opacity-60">
        <img src="/Godfather.jpg" alt="movie poster" className="w-full h-full object-cover" />
        <img src="/The_Batman.jpeg" alt="movie poster" className="w-full h-full object-cover" />
        <img src="/Seven.jpg" alt="movie poster" className="w-full h-full object-cover" />
        <img src="/image4.jpg" alt="movie poster" className="w-full h-full object-cover" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-300 to-primary opacity-80"></div>

      {/* Register Form */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-200/80 backdrop-blur-xl shadow-xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <img src="/MainLogo.png" alt="Moodboard Logo" className="h-28 mx-auto" />
              <p className="mt-2 text-base-content/70">Create your movie universe account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
                {errors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.username}</span>
                  </label>
                )}
              </div>

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
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password}</span>
                  </label>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Create Account
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{' '}
                <Link to="/login" className="link link-primary">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;