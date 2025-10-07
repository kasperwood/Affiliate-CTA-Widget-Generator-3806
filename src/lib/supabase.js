import { createClient } from '@supabase/supabase-js'

// Project details for organization ID: qtgessncqjsvojjpjlvs
// Project ID: dggqgwfpjwpjemgzqpdb
const SUPABASE_URL = 'https://dggqgwfpjwpjemgzqpdb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnZ3Fnd2ZwandwamVtZ3pxcGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjAwMTIsImV4cCI6MjA3MDgzNjAxMn0.LfDqabaNVgDzt6_p1I0EtL0vbkCU0jJQCDTSdBqMogM'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase