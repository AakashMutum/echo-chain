-- Add bio column to profile_details table
ALTER TABLE public.profile_details 
ADD COLUMN IF NOT EXISTS bio TEXT;
