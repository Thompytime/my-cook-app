// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)