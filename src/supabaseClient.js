import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://nazgwjwnruxfmbbvpeft.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hemd3anducnV4Zm1iYnZwZWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODk5OTEsImV4cCI6MjA3ODk2NTk5MX0.-fMo2lushMvQUTlyppV7IN3Gx3lV8_YOdqmhoXiHrwE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
