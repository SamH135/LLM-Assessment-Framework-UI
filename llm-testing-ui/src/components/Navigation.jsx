import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TestTube2, GitBranch, Lock, LogOut, BarChart2 } from 'lucide-react';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-white p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          LLM Testing Framework
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive('/') ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          
          <Link
            to="/test"
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive('/test') ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            <TestTube2 className="h-4 w-4" />
            Run Tests
          </Link>

          <Link
            to="/results"
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive('/results') ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            Test Results
          </Link>

          <Link
            to="/contribute"
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive('/contribute') ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            <GitBranch className="h-4 w-4" />
            Contribute
          </Link>

          <Link
            to="/change-password"
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive('/change-password') ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            <Lock className="h-4 w-4" />
            Change Password
          </Link>

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