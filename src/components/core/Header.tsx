import React from 'react';
import { MessageSquare, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">QuickChat</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              <div className="flex items-center">
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900">
                    <span className="hidden md:block mr-2 text-sm font-medium">
                      {user.username}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </a>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!user && (
            <Button variant="primary" size="sm">Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;