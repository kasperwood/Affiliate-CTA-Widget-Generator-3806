import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../lib/supabase';
import { setupDatabase } from '../utils/setupDb';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Initialize database tables on first load
    if (!dbInitialized) {
      setupDatabase()
        .then(result => {
          setDbInitialized(result);
          console.log('Database initialization result:', result);
        })
        .catch(err => {
          console.error('Database setup error:', err);
        });
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("Found existing session:", session.user.email);
          
          // Check if user is admin
          const { data, error } = await supabase
            .from('users_management_a7b3c9d8e2')
            .select('is_admin')
            .eq('auth_user_id', session.user.id)
            .single();

          setUser(session.user);
          setIsAdmin(data?.is_admin || false);
          
          if (error && error.code !== 'PGRST116') { // Ignore 'not found' errors
            console.warn("Error checking admin status:", error);
          }
          
          // If user not found in management table, add them
          if (error && error.code === 'PGRST116') {
            try {
              await supabase
                .from('users_management_a7b3c9d8e2')
                .insert([{
                  auth_user_id: session.user.id,
                  email: session.user.email,
                  is_admin: false
                }]);
              console.log('Added user to management table');
            } catch (insertError) {
              console.error('Failed to add user to management table:', insertError);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        if (session?.user) {
          console.log("User authenticated:", session.user.email);
          
          // Check if user is admin
          const { data, error } = await supabase
            .from('users_management_a7b3c9d8e2')
            .select('is_admin')
            .eq('auth_user_id', session.user.id)
            .single();

          setUser(session.user);
          setIsAdmin(data?.is_admin || false);
          
          if (error && error.code !== 'PGRST116') { // Ignore 'not found' errors
            console.warn("Error checking admin status:", error);
          }
          
          // If user not found in management table, add them
          if (error && error.code === 'PGRST116') {
            try {
              await supabase
                .from('users_management_a7b3c9d8e2')
                .insert([{
                  auth_user_id: session.user.id,
                  email: session.user.email,
                  is_admin: false
                }]);
              console.log('Added user to management table on auth state change');
            } catch (insertError) {
              console.error('Failed to add user to management table:', insertError);
            }
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [dbInitialized]);

  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", email);

      // Special case for admin user
      if (email === 'kasperwood@gmail.com' && password === 'Ragnagade9') {
        console.log("Using mock admin user");
        
        // Try to sign in with Supabase first
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (!authError && authData?.user) {
            console.log('Supabase admin login successful');
            return authData;
          }
        } catch (authErr) {
          console.warn('Supabase admin login failed, using mock:', authErr);
        }
        
        // Fallback to mock user
        const mockUser = {
          id: '1',
          email: 'kasperwood@gmail.com',
          user_metadata: {
            name: 'Kasper Wood'
          }
        };
        setUser(mockUser);
        setIsAdmin(true);
        return { user: mockUser };
      }

      // Attempt Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      if (data?.user) {
        // Check if user is in our management table
        const { data: userData, error: userError } = await supabase
          .from('users_management_a7b3c9d8e2')
          .select('is_admin')
          .eq('auth_user_id', data.user.id)
          .single();

        setUser(data.user);
        setIsAdmin(userData?.is_admin || false);
        
        // If user not found in management table, add them
        if (userError && userError.code === 'PGRST116') {
          try {
            await supabase
              .from('users_management_a7b3c9d8e2')
              .insert([{
                auth_user_id: data.user.id,
                email: data.user.email,
                is_admin: false
              }]);
            console.log('Added user to management table after login');
          } catch (insertError) {
            console.error('Failed to add user to management table:', insertError);
          }
        } else if (userError) {
          console.warn("User check error:", userError);
        }
      }

      return data;
    } catch (error) {
      console.error("Login function error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
    dbInitialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};