import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const NavBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { handleSearch } = useSearch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="navbar bg-base-200/80 backdrop-blur-lg fixed top-0 z-50 border-b border-base-300 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            <li><a>Homepage</a></li>
            <li><a>Movies</a></li>
            <li><a>About</a></li>
          </ul>
        </div>
        <img src="/MainLogo.png" alt="Moodboard Logo" className="h-12 hidden lg:block" />
      </div>

      <div className="navbar-center flex-grow max-w-xl">
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search movies..." 
              className="input input-bordered w-full pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </form>
      </div>

      <div className="navbar-end gap-2">
        <div className="avatar">
          <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src="/simple-user-default-icon-free-png.jpeg" alt="User avatar" />
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
      </div>
    </div>
  );
};

export default NavBar;