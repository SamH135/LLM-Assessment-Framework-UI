import React, { useState } from 'react';
import { Home, TestTube2 } from 'lucide-react';
import HomePage from './components/pages/HomePage';
import TestPage from './components/pages/TestPage';

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage }) => (
  <nav className="bg-slate-800 text-white p-4 mb-6">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">LLM Testing Framework</h1>
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            currentPage === 'home' ? 'bg-slate-600' : 'hover:bg-slate-700'
          }`}
        >
          <Home className="h-4 w-4" />
          Home
        </button>
        <button
          onClick={() => setCurrentPage('test')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            currentPage === 'test' ? 'bg-slate-600' : 'hover:bg-slate-700'
          }`}
        >
          <TestTube2 className="h-4 w-4" />
          Run Tests
        </button>
      </div>
    </div>
  </nav>
);

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="py-8">
        {currentPage === 'home' ? (
          <HomePage setCurrentPage={setCurrentPage} />
        ) : (
          <TestPage />
        )}
      </main>
    </div>
  );
};

export default App;