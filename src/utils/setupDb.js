import supabase from '../lib/supabase';
import { initializeWidgetsTable } from './widgetService';

/**
 * Sets up the database tables required for the application
 * This script can be run manually to ensure the database is properly configured
 */
const setupDatabase = async () => {
  console.log('Setting up database tables...');
  
  try {
    // Check if users_management table exists
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'users_management_a7b3c9d8e2')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking table existence:', checkError);
      // Continue anyway as we'll try to create it
    }

    // If table doesn't exist, create it
    if (!existingTables || existingTables.length === 0) {
      // Create users management table with RPC
      const { error: tableError } = await supabase.rpc('create_users_management_table', {
        table_name: 'users_management_a7b3c9d8e2'
      });

      if (tableError) {
        console.error('Error creating user management table:', tableError);
        return false;
      }
    }

    console.log('User management table created successfully');

    // Create default admin user
    const { error: insertError } = await supabase
      .from('users_management_a7b3c9d8e2')
      .upsert([
        {
          email: 'kasperwood@gmail.com',
          is_admin: true
        }
      ], { 
        onConflict: 'email',
        ignoreDuplicates: true 
      });

    if (insertError) {
      console.error('Error creating admin user:', insertError);
    } else {
      console.log('Admin user created/updated successfully');
    }

    // Initialize widgets table
    const widgetsInitialized = await initializeWidgetsTable();
    if (!widgetsInitialized) {
      console.error('Failed to initialize widgets table');
      return false;
    }

    console.log('Database setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
};

export { setupDatabase };