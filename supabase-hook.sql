-- Supabase "before user created" hook script
-- Copy this into your Supabase dashboard: Authentication > Hooks > Before user created

-- This script runs BEFORE the user is created in auth.users
-- We'll create the user profile and default box AFTER the user is created

-- The actual logic will be handled by the "after user created" hook
-- This is just a placeholder to ensure the hook is active

-- Return the user data unchanged
return { user: user, error: null }; 