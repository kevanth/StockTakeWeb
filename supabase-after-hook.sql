-- Supabase "after user created" hook script
-- Copy this into your Supabase dashboard: Authentication > Hooks > After user created

-- This script runs AFTER the user is created in auth.users
-- We'll create the user profile and default box here

-- Extract username from user metadata
const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';

-- Create user profile
const { error: profileError } = await supabase
  .from('user_profiles')
  .insert({
    user_id: user.id,
    username: username
  });

if (profileError) {
  console.error('Error creating user profile:', profileError);
}

-- Create default box for the user
const { error: boxError } = await supabase
  .from('boxes')
  .insert({
    name: 'General',
    owner_id: user.id
  });

if (boxError) {
  console.error('Error creating default box:', boxError);
}

-- Return success
return { user: user, error: null }; 