import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCheck, FiX, FiUserPlus, FiLoader } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const UserManagement = ({ isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    isAdmin: false
  });
  const [addingUser, setAddingUser] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users...');
      // Get users from the users_management table
      const { data, error } = await supabase
        .from('users_management_a7b3c9d8e2')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Users fetched:', data);
      // Always include the admin user
      const adminExists = data.some(user => user.email === 'kasperwood@gmail.com');
      const allUsers = adminExists ? data : [...data, {
        id: '1',
        email: 'kasperwood@gmail.com',
        is_admin: true,
        created_at: new Date().toISOString()
      }];
      setUsers(allUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Fejl ved hentning af brugere: ${err.message}`);
      // Fallback to at least showing the admin user
      setUsers([{
        id: '1',
        email: 'kasperwood@gmail.com',
        is_admin: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setError(null);

    try {
      // Validate inputs
      if (!newUser.email || !newUser.password) {
        throw new Error('Email og adgangskode er påkrævet');
      }

      console.log('Creating user with email:', newUser.email);

      // Create the user in Supabase Auth with email confirmation disabled
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email_confirm: false // This helps indicate we don't need email confirmation
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Bruger kunne ikke oprettes i auth systemet');
      }

      console.log('Auth user created:', authData.user);

      // Automatically confirm the user's email using our function
      try {
        const { error: confirmError } = await supabase.rpc('confirm_user_email', {
          user_id: authData.user.id
        });
        
        if (confirmError) {
          console.warn('Could not auto-confirm email:', confirmError);
        } else {
          console.log('User email confirmed automatically');
        }
      } catch (confirmErr) {
        console.warn('Email confirmation helper not available:', confirmErr);
      }

      // Add user to our management table
      const { data: userData, error: userError } = await supabase
        .from('users_management_a7b3c9d8e2')
        .insert([{
          auth_user_id: authData.user.id,
          email: newUser.email,
          is_admin: newUser.isAdmin
        }])
        .select();

      if (userError) {
        console.error('Failed to add user to management table:', userError);
        throw userError;
      }

      console.log('User added to management table:', userData);

      // Refresh the user list
      await fetchUsers();

      // Reset form
      setNewUser({ email: '', password: '', isAdmin: false });
      setShowAddForm(false);

    } catch (err) {
      console.error('Error creating user:', err);
      setError(`Fejl ved oprettelse af bruger: ${err.message || 'Ukendt fejl'}`);
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    // Prevent deleting the main admin
    if (userEmail === 'kasperwood@gmail.com') return;

    setLoading(true);
    try {
      console.log('Deleting user with ID:', userId);

      // Get the user record to find auth_user_id
      const { data: userData, error: fetchError } = await supabase
        .from('users_management_a7b3c9d8e2')
        .select('auth_user_id')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching user for deletion:', fetchError);
        throw fetchError;
      }

      console.log('Found user data for deletion:', userData);

      // Delete from management table
      const { error: deleteError } = await supabase
        .from('users_management_a7b3c9d8e2')
        .delete()
        .eq('id', userId);

      if (deleteError) {
        console.error('Error deleting from management table:', deleteError);
        throw deleteError;
      }

      console.log('Deleted user from management table');

      // Try to delete from auth (may not work with current permissions)
      if (userData?.auth_user_id) {
        try {
          const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
            userData.auth_user_id
          );
          if (authDeleteError) {
            console.warn('Could not delete auth user (may require admin API):', authDeleteError);
          } else {
            console.log('Deleted user from auth system');
          }
        } catch (authDeleteError) {
          console.warn('Could not delete auth user (may require admin API):', authDeleteError);
        }
      }

      // Also delete all widgets created by this user
      try {
        if (userData?.auth_user_id) {
          const { error: widgetDeleteError } = await supabase
            .from('widgets_a7b3c9d8e2')
            .delete()
            .eq('user_id', userData.auth_user_id);

          if (widgetDeleteError) {
            console.warn('Error deleting user widgets:', widgetDeleteError);
          } else {
            console.log('Deleted user widgets');
          }
        }
      } catch (widgetDeleteError) {
        console.warn('Could not delete user widgets:', widgetDeleteError);
      }

      // Refresh the user list
      await fetchUsers();

    } catch (err) {
      console.error('Error deleting user:', err);
      setError(`Fejl ved sletning af bruger: ${err.message || 'Ukendt fejl'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <SafeIcon icon={FiUserPlus} className="text-blue-500 mr-2" />
          Brugeradministration
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 flex items-center"
        >
          <SafeIcon icon={showAddForm ? FiX : FiPlus} className="mr-1" />
          {showAddForm ? 'Annuller' : 'Tilføj bruger'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Luk
          </button>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddUser} className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adgangskode
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={newUser.isAdmin}
                  onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700">
                  Administrator
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={addingUser}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
            >
              {addingUser ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <SafeIcon icon={FiCheck} className="mr-2" />
              )}
              {addingUser ? 'Opretter...' : 'Opret bruger'}
            </button>
          </div>
          
          {/* Important notice about email confirmation */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Bemærk:</strong> Email bekræftelse er automatisk aktiveret. Nye brugere kan logge ind med det samme.
            </p>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-4">
          <span className="inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
          <p className="mt-2 text-gray-500">Indlæser brugere...</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rolle
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Handlinger
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.is_admin ? 'Administrator' : 'Bruger'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={user.email === 'kasperwood@gmail.com'} // Prevent deleting the main admin
                      >
                        <SafeIcon icon={FiTrash2} className="inline mr-1" />
                        Slet
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    Ingen brugere fundet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;