import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL atau Anon Key tidak ditemukan di environment variables!');
  throw new Error('Missing Supabase configuration');
}

console.log('Supabase URL:', supabaseUrl); // Debug: Pastikan URL benar

export const supabase = createClient(supabaseUrl, supabaseAnonKey);