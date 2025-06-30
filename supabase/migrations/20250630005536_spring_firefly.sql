/*
  # Initial Auth Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `phone` (text, nullable)
      - `role` (enum: 'customer', 'delivery', 'vendor')
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `total_orders` (integer)
      - `points` (integer)
      - `rating` (numeric)
      - `member_since` (timestamptz)
      - `business_name` (text, nullable)
      - `business_type` (text, nullable)
      - `address` (text, nullable)
      - `operating_hours` (text, nullable)

    - `food_items`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text, nullable)
      - `price` (integer, in kobo)
      - `category` (text)
      - `image_url` (text, nullable)
      - `prep_time` (text, nullable)
      - `ingredients` (text, nullable)
      - `status` (enum: 'active', 'inactive')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Create triggers for updated_at timestamps
*/

-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('customer', 'delivery', 'vendor');

-- Create food_item_status enum type
CREATE TYPE food_item_status AS ENUM ('active', 'inactive');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role user_role DEFAULT 'customer'::user_role,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  total_orders integer DEFAULT 0,
  points integer DEFAULT 0,
  rating numeric DEFAULT 0,
  member_since timestamptz DEFAULT now(),
  business_name text,
  business_type text,
  address text,
  operating_hours text
);

-- Create food_items table
CREATE TABLE IF NOT EXISTS food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  category text DEFAULT 'main-course',
  image_url text,
  prep_time text,
  ingredients text,
  status food_item_status DEFAULT 'active'::food_item_status,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER food_items_updated_at
  BEFORE UPDATE ON food_items
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for food_items
CREATE POLICY "Vendors can view own food items"
  ON food_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert own food items"
  ON food_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update own food items"
  ON food_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete own food items"
  ON food_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = vendor_id);

CREATE POLICY "Everyone can view active food items"
  ON food_items
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS food_items_vendor_id_idx ON food_items(vendor_id);
CREATE INDEX IF NOT EXISTS food_items_category_idx ON food_items(category);
CREATE INDEX IF NOT EXISTS food_items_status_idx ON food_items(status);

-- Create a trigger function to create a profile after a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, member_since)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'role')::user_role,
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function after a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();