import React from "react";
import { Routes, Route} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import { SearchProvider } from './context/SearchContext';

function App(){
  return(
    <SearchProvider>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/movie/:id" element={
          <ProtectedRoute>
            <MoviePage />
          </ProtectedRoute>
        } />
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </SearchProvider>
  );
}

export default App;
