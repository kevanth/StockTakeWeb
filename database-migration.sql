-- Migration script to use Supabase Auth instead of custom users table
-- Run this in your Supabase SQL editor

-- 1. Add user_id column to items table
ALTER TABLE items 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 2. Migrate existing data (if any) - you'll need to manually map usernames to user IDs
-- UPDATE items SET user_id = (SELECT id FROM auth.users WHERE user_metadata->>'username' = items.owner);

-- 3. Make user_id NOT NULL after migration
-- ALTER TABLE items ALTER COLUMN user_id SET NOT NULL;

-- 4. Remove the owner column (after confirming migration worked)
-- ALTER TABLE items DROP COLUMN owner;

-- 5. Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
-- Policy to only allow users to see their own items
CREATE POLICY "Users can only access their own items" ON items
FOR ALL USING (auth.uid() = user_id);

-- Policy to only allow users to insert items for themselves
CREATE POLICY "Users can only insert items for themselves" ON items
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to only allow users to update their own items
CREATE POLICY "Users can only update their own items" ON items
FOR UPDATE USING (auth.uid() = user_id);

-- Policy to only allow users to delete their own items
CREATE POLICY "Users can only delete their own items" ON items
FOR DELETE USING (auth.uid() = user_id);

-- 7. Drop the custom users table (after confirming everything works)
-- DROP TABLE IF EXISTS users; 