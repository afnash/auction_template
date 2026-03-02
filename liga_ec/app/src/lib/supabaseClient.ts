import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('⚠️ Supabase URL is using the placeholder. Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
