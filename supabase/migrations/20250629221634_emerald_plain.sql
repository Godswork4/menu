/*
  # Food Explorer App Schema Setup

  1. New Tables
    - `budget_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `target_amount` (integer, in kobo)
      - `current_amount` (integer, in kobo)
      - `deadline` (date)
      - `category` (text)
      - `is_completed` (boolean)
      - `is_recurring` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `budget_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `budget_id` (uuid, references budget_goals, nullable)
      - `amount` (integer, in kobo)
      - `description` (text)
      - `category` (text)
      - `transaction_date` (date)
      - `restaurant` (text, nullable)
      - `created_at` (timestamptz)

    - `meal_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `date` (date)
      - `meal_type` (text)
      - `food_name` (text)
      - `restaurant` (text)
      - `price` (integer, in kobo)
      - `image_url` (text, nullable)
      - `scheduled_time` (time)
      - `is_ordered` (boolean)
      - `is_recurring` (boolean)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create budget_goals table
CREATE TABLE IF NOT EXISTS budget_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount integer NOT NULL,
  current_amount integer DEFAULT 0,
  deadline date NOT NULL,
  category text NOT NULL,
  is_completed boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create budget_transactions table
CREATE TABLE IF NOT EXISTS budget_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  budget_id uuid REFERENCES budget_goals(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  transaction_date date NOT NULL,
  restaurant text,
  created_at timestamptz DEFAULT now()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  meal_type text NOT NULL,
  food_name text NOT NULL,
  restaurant text NOT NULL,
  price integer NOT NULL,
  image_url text,
  scheduled_time time NOT NULL,
  is_ordered boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE budget_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for budget_goals
CREATE POLICY "Users can view own budget goals"
  ON budget_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget goals"
  ON budget_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget goals"
  ON budget_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget goals"
  ON budget_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for budget_transactions
CREATE POLICY "Users can view own budget transactions"
  ON budget_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget transactions"
  ON budget_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget transactions"
  ON budget_transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget transactions"
  ON budget_transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for meal_plans
CREATE POLICY "Users can view own meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON meal_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON meal_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
  ON meal_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER budget_goals_updated_at
  BEFORE UPDATE ON budget_goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS budget_goals_user_id_idx ON budget_goals(user_id);
CREATE INDEX IF NOT EXISTS budget_goals_category_idx ON budget_goals(category);
CREATE INDEX IF NOT EXISTS budget_transactions_user_id_idx ON budget_transactions(user_id);
CREATE INDEX IF NOT EXISTS budget_transactions_budget_id_idx ON budget_transactions(budget_id);
CREATE INDEX IF NOT EXISTS budget_transactions_category_idx ON budget_transactions(category);
CREATE INDEX IF NOT EXISTS meal_plans_user_id_idx ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS meal_plans_date_idx ON meal_plans(date);
CREATE INDEX IF NOT EXISTS meal_plans_meal_type_idx ON meal_plans(meal_type);