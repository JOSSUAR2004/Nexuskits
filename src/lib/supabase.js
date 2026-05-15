import { createClient } from '@supabase/supabase-js'

// Estos datos los sacas de Project Settings > API en tu panel de Supabase
const supabaseUrl = 'https://mjuhyfpsagpsjtzceljt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdWh5ZnBzYWdwc2p0emNlbGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NDIyMDQsImV4cCI6MjA5MzUxODIwNH0.QQ-k_2HK7jC0IQ858q8Giej40314kFlvIxWCHOVg3RA' 

export const supabase = createClient(supabaseUrl, supabaseKey)