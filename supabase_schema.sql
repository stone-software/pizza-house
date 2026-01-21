-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  image TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  is_popular BOOLEAN DEFAULT false,
  is_action BOOLEAN DEFAULT false,
  weight TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Admin All Categories" ON categories;
DROP POLICY IF EXISTS "Admin All Products" ON products;
DROP POLICY IF EXISTS "Migration All Categories" ON categories;
DROP POLICY IF EXISTS "Migration All Products" ON products;

-- Create policies (Public read, Admin all)
-- For now, allow public read
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Admin policies (assuming auth.uid() is handled via Supabase Auth)
-- You will need to setup a 'users' table or use custom claims to identify admin
-- For simplicity in this demo, we can allow authenticated users to manage
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Products" ON products FOR ALL TO authenticated USING (true);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_time TEXT,
  payment_method TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Налаштування безпеки
-- Налаштування безпеки
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public All Access" ON orders;

-- Allow anyone to create an order
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);

-- Allow admins (authenticated users) to select, update, and delete orders
CREATE POLICY "Admin Select Orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin Update Orders" ON orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete Orders" ON orders FOR DELETE TO authenticated USING (true);
