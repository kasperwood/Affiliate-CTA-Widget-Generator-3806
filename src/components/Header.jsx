import React from 'react';
import { FiLogOut, FiUser, FiGrid } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-md py-4 px-6 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <SafeIcon icon={FiGrid} className="text-blue-600 text-2xl mr-2" />
          <h1 className="text-xl font-bold text-gray-800">The Affiliate Widget Generator</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <SafeIcon icon={FiUser} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.email}</p>
              {isAdmin && (
                <span className="text-xs text-purple-600 font-medium">Administrator</span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded flex items-center text-sm"
          >
            <SafeIcon icon={FiLogOut} className="mr-1" />
            Log ud
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;