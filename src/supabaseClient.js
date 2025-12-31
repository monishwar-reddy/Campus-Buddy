import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
export const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Safe initialization or migration stub
const isConfigured = process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = isConfigured
    ? createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)
    : {
        from: () => ({ select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: { message: "Supabase not configured. Migrating to Firebase." } }) }) }) }),
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } })
        }
    }
