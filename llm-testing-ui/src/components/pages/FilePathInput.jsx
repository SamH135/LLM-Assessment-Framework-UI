import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Clock } from 'lucide-react';

const FilePathInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter path to prompts file",
  disabled = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentPaths, setRecentPaths] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load recent paths from localStorage on component mount
  useEffect(() => {
    const savedPaths = localStorage.getItem('recentPromptPaths');
    if (savedPaths) {
      try {
        setRecentPaths(JSON.parse(savedPaths));
      } catch (error) {
        console.error('Error parsing saved paths:', error);
        // Reset if there's an error parsing
        localStorage.removeItem('recentPromptPaths');
      }
    }
  }, []);

  // Save path to recent paths when it changes and input is not empty
  const savePathToRecent = (path) => {
    if (!path || path.trim() === '') return;
    
    setRecentPaths(prevPaths => {
      // Create new array with the current path at the beginning
      // and remove any duplicates
      const newPaths = [path, ...prevPaths.filter(p => p !== path)].slice(0, 5);
      
      // Save to localStorage
      localStorage.setItem('recentPromptPaths', JSON.stringify(newPaths));
      
      return newPaths;
    });
  };

  // Handle selecting a path from recent list
  const handleSelectPath = (path) => {
    onChange({ target: { value: path } });
    setIsDropdownOpen(false);
    // Move focus back to the input after selection
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    onChange(e);
  };

  // Handle input blur - save path if changed
  const handleInputBlur = () => {
    if (value) {
      savePathToRecent(value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full">
        <div className="relative flex-1 w-full">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={placeholder}
            className="w-full p-2 border rounded pr-8"
            disabled={disabled}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Recent paths dropdown */}
      {isDropdownOpen && recentPaths.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <div className="p-2 text-xs text-gray-500 border-b flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Recent Paths
          </div>
          <ul>
            {recentPaths.map((path, index) => (
              <li 
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm truncate"
                onClick={() => handleSelectPath(path)}
              >
                {path}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilePathInput;