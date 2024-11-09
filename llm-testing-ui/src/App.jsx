import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/pages/HomePage';
import TestPage from './components/pages/TestPage';
import ContributePage from './components/pages/ContributePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('home');
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
    setShowRegister(false);
  };

  // If not logged in, show login or register page
  if (!user) {
    if (showRegister) {
      return (
        <RegisterPage 
          onRegisterSuccess={handleLogin}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginPage 
        onLoginSuccess={handleLogin}
        onRegisterClick={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="py-8">
        {currentPage === 'home' ? (
          <HomePage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'test' ? (
          <TestPage />
        ) : currentPage === 'contribute' ? (
          <ContributePage />
        ) : (
          <ChangePasswordPage />
        )}
      </main>
    </div>
  );
};

export default App;