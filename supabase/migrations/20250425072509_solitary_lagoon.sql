/*
  # Initial Schema Setup for QuickChat

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - username (text)
      - user_language (text)
      - target_language (text)
      - created_at (timestamptz)
      
    - categories
      - id (uuid, primary key)
      - name (text)
      - icon (text)
      - user_id (uuid, foreign key)
      - is_custom (boolean)
      - created_at (timestamptz)
      
    - phrases
      - id (uuid, primary key)
      - english (text)
      - translated (text)
      - category_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - is_custom (boolean)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create new categories and phrases
      - Update their own categories and phrases
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  username text NOT NULL,
  user_language text NOT NULL DEFAULT 'en',
  target_language text NOT NULL DEFAULT 'es',
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  user_id uuid REFERENCES users(id),
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create phrases table
CREATE TABLE IF NOT EXISTS phrases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  english text NOT NULL,
  translated text,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for categories table
CREATE POLICY "Users can read own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for phrases table
CREATE POLICY "Users can read phrases"
  ON phrases
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create phrases"
  ON phrases
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own phrases"
  ON phrases
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());