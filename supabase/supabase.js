import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjjffydbwvxufgkskepq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqamZmeWRid3Z4dWZna3NrZXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3MjUyNDgsImV4cCI6MjA0MDMwMTI0OH0.ueA-Simrx4gYeD65rRptGfPMH58mQF0kSfcQuHN2E_A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})