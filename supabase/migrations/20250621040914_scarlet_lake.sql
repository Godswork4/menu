/*
  # Add Vendor Management Tables

  1. New Tables
    - `food_items`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `price` (integer, in kobo)
      - `category` (text)
      - `image_url` (text)
      - `prep_time` (text)
      - `ingredients` (text)
      - `status` (enum: active, inactive)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vendor_orders`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references profiles)
      - `customer_id` (uuid, references profiles)
      - `food_items` (jsonb)
      - `total_amount` (integer, in kobo)
      - `status` (enum: pending, confirmed, preparing, ready, delivered, cancelled)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for vendors to manage their own data
    - Add policies for customers to view vendor data
*/

-- Create custom types
CREATE TYPE food_item_status AS ENUM ('active', 'inactive');
CREATE TYPE vendor_order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

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
  status food_item_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vendor_orders table
CREATE TABLE IF NOT EXISTS vendor_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  food_items jsonb NOT NULL,
  total_amount integer NOT NULL,
  status vendor_order_status DEFAULT 'pending',
  delivery_address text,
  customer_phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for food_items
CREATE POLICY "Vendors can manage own food items"
  ON food_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = vendor_id);

CREATE POLICY "Anyone can view active food items"
  ON food_items
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Public can view active food items"
  ON food_items
  FOR SELECT
  TO anon
  USING (status = 'active');

-- Create policies for vendor_orders
CREATE POLICY "Vendors can view own orders"
  ON vendor_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = vendor_id);

CREATE POLICY "Customers can view own orders"
  ON vendor_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create orders"
  ON vendor_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Vendors can update own orders"
  ON vendor_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = vendor_id);

-- Create triggers for updated_at
CREATE TRIGGER food_items_updated_at
  BEFORE UPDATE ON food_items
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER vendor_orders_updated_at
  BEFORE UPDATE ON vendor_orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS food_items_vendor_id_idx ON food_items(vendor_id);
CREATE INDEX IF NOT EXISTS food_items_status_idx ON food_items(status);
CREATE INDEX IF NOT EXISTS food_items_category_idx ON food_items(category);
CREATE INDEX IF NOT EXISTS vendor_orders_vendor_id_idx ON vendor_orders(vendor_id);
CREATE INDEX IF NOT EXISTS vendor_orders_customer_id_idx ON vendor_orders(customer_id);
CREATE INDEX IF NOT EXISTS vendor_orders_status_idx ON vendor_orders(status);