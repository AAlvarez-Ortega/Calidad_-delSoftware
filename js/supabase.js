// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://peihwfqfumcgxdbdshgf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlaWh3ZnFmdW1jZ3hkYmRzaGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzU4NjMsImV4cCI6MjA2MzkxMTg2M30.Q7RuagDwFliqNHXSD0Xgg3zSBXxXHkqOnsO5YMSI3yY';
export const supabase = createClient(supabaseUrl, supabaseKey);
