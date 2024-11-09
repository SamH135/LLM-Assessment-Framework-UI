import React from 'react';
import { Home, TestTube2, GitBranch, Lock, LogOut } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage, user, onLogout }) => {
  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-white p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">LLM Testing Framework</h1>
        <div className="flex items-center gap-4">
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
          <button
            onClick={() => setCurrentPage('contribute')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              currentPage === 'contribute' ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            <GitBranch className="h-4 w-4" />
            Contribute
          </button>
          <button
            onClick={() => setCurrentPage('change-password')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              currentPage === 'change-password' ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            <Lock className="h-4 w-4" />
            Change Password
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <span className="text-sm">Welcome, {user.fullName}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;