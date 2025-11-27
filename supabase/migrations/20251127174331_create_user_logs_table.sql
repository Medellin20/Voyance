/*
  # Create user logs table

  1. New Tables
    - `user_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `action_type` (text: signup, signin, contact, etc)
      - `email` (text)
      - `full_name` (text)
      - `phone` (text, nullable)
      - `message` (text, nullable for contact forms)
      - `created_at` (timestamp)
      - `email_sent` (boolean, tracks if email was sent)

  2. Security
    - Enable RLS on `user_logs` table
    - Add policy for authenticated users to read their own logs
    - Add policy for system to insert logs
*/

CREATE TABLE IF NOT EXISTS user_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  email text NOT NULL,
  full_name text,
  phone text,
  message text,
  created_at timestamptz DEFAULT now(),
  email_sent boolean DEFAULT false
);

ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON user_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert logs"
  ON user_logs FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "System can update logs"
  ON user_logs FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_user_logs_user_id ON user_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_action_type ON user_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_user_logs_created_at ON user_logs(created_at);
