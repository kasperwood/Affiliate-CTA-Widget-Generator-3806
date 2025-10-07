import React, { useState, useEffect } from 'react';
import { setupDatabase } from '../utils/setupDb';
import { FiDatabase, FiRefreshCw, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const DbInitializer = () => {
  const [status, setStatus] = useState('pending'); // pending, loading, success, error
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const initializeDb = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const result = await setupDatabase();
      if (result) {
        setStatus('success');
        setMessage('Database tables initialized successfully.');
      } else {
        setStatus('error');
        setMessage('Failed to initialize database tables. Check console for details.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
      console.error('Database initialization error:', error);
    }
  };

  useEffect(() => {
    // Automatically try to initialize on component mount
    initializeDb();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <SafeIcon icon={FiDatabase} className="text-blue-500" />
          Database Initialization
        </h2>
        {status !== 'loading' && (
          <button
            onClick={initializeDb}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <SafeIcon icon={FiRefreshCw} />
            Reinitialize
          </button>
        )}
      </div>

      <div className={`p-4 rounded-md mb-4 ${
        status === 'loading' ? 'bg-blue-50 text-blue-700' :
        status === 'success' ? 'bg-green-50 text-green-700' :
        status === 'error' ? 'bg-red-50 text-red-700' :
        'bg-gray-50 text-gray-700'
      }`}>
        <div className="flex items-center gap-2">
          {status === 'loading' && (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
          {status === 'success' && <SafeIcon icon={FiCheckCircle} className="text-green-600" />}
          {status === 'error' && <SafeIcon icon={FiAlertTriangle} className="text-red-600" />}
          {status === 'pending' && <SafeIcon icon={FiDatabase} className="text-gray-600" />}
          
          <span className="font-medium">
            {status === 'loading' ? 'Initializing database...' :
             status === 'success' ? 'Database initialized' :
             status === 'error' ? 'Initialization failed' :
             'Database initialization pending'}
          </span>
        </div>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>

      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
        
        {showDetails && (
          <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <p className="mb-2">This component attempts to create the following database tables:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>users_management_a7b3c9d8e2 - Stores user management information</li>
              <li>widgets_a7b3c9d8e2 - Stores widget data with user relationships</li>
            </ul>
            
            <p className="mt-2">
              If you encounter issues, ensure your Supabase connection is properly configured and that you have the necessary permissions.
            </p>
            
            <p className="mt-2">
              Note: For this application to work properly, you need to create two stored procedures in your Supabase SQL editor:
            </p>
            
            <pre className="bg-gray-100 p-2 mt-2 overflow-x-auto text-xs">
{`-- Create stored procedure for users_management table
CREATE OR REPLACE FUNCTION create_users_management_table(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      auth_user_id UUID,
      email TEXT NOT NULL UNIQUE,
      is_admin BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )', table_name);
    
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow public read access" 
      ON %I 
      FOR SELECT 
      TO anon
      USING (true)', table_name);
      
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Users can manage own records" 
      ON %I 
      FOR ALL 
      USING (auth.uid() = auth_user_id)', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create stored procedure for widgets table
CREATE OR REPLACE FUNCTION create_widgets_table(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      product_title TEXT NOT NULL,
      product_description TEXT,
      product_image TEXT,
      original_price TEXT,
      discounted_price TEXT,
      cta_text TEXT,
      affiliate_link TEXT NOT NULL,
      background_color TEXT,
      button_color TEXT,
      text_color TEXT,
      language TEXT DEFAULT ''da'',
      usps JSONB DEFAULT ''[]''::jsonb,
      custom_usps JSONB DEFAULT ''[]''::jsonb,
      show_shipping_countdown BOOLEAN DEFAULT false,
      shipping_deadline TEXT,
      show_apple_pay BOOLEAN DEFAULT false,
      show_google_pay BOOLEAN DEFAULT false,
      show_mobile_pay BOOLEAN DEFAULT false,
      stock_status TEXT,
      show_testimonial BOOLEAN DEFAULT false,
      testimonial_text TEXT,
      testimonial_name TEXT,
      testimonial_image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )', table_name);
    
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Allow public read access" 
      ON %I 
      FOR SELECT 
      TO anon
      USING (true)', table_name);
      
  EXECUTE format('
    CREATE POLICY IF NOT EXISTS "Users can manage own widgets" 
      ON %I 
      FOR ALL 
      USING (auth.uid() = user_id)', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DbInitializer;