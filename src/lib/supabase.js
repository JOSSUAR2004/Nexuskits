import { createClient } from '@supabase/supabase-js'

// Ahora el código es seguro: lee los datos del archivo .env o de Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)