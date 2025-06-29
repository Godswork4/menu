/*
  # Add Vendor Profile Fields

  1. Updates
    - Add vendor-specific fields to the profiles table:
      - `business_name` (text)
      - `business_type` (text)
      - `address` (text)
      - `operating_hours` (text)

  2. Security
    - Maintain existing RLS policies
*/

-- Add vendor-specific fields to profiles table
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS business_type text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS operating_hours text;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_business_name_idx ON profiles(business_name);
CREATE INDEX IF NOT EXISTS profiles_business_type_idx ON profiles(business_type);