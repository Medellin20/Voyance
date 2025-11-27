/*
  # Create Voyance Application Schema

  ## Tables Created
  
  1. **profiles** - Extended user information
    - `id` (uuid, references auth.users)
    - `email` (text)
    - `full_name` (text)
    - `phone` (text, optional)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  2. **packs** - Subscription packages
    - `id` (uuid, primary key)
    - `name` (text) - Pack name
    - `duration_months` (integer) - Duration in months
    - `price` (numeric) - Price in euros
    - `features` (jsonb) - Array of features
    - `popular` (boolean) - Mark popular pack
    - `created_at` (timestamptz)

  3. **testimonials** - Customer testimonials
    - `id` (uuid, primary key)
    - `author_name` (text)
    - `content` (text)
    - `rating` (integer) - 1-5 stars
    - `created_at` (timestamptz)

  4. **contacts** - Contact form submissions
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users, optional)
    - `name` (text)
    - `email` (text)
    - `message` (text)
    - `contact_type` (text) - whatsapp, gmail, form
    - `created_at` (timestamptz)

  5. **subscriptions** - User subscriptions
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `pack_id` (uuid, references packs)
    - `status` (text) - pending, active, expired
    - `payment_method` (text) - rib, paypal
    - `start_date` (timestamptz)
    - `end_date` (timestamptz)
    - `created_at` (timestamptz)

  ## Security
  
  - Enable RLS on all tables
  - Users can read all packs and testimonials
  - Users can read/update their own profile
  - Users can create contacts and read their own
  - Users can read their own subscriptions
  - Authenticated users can create subscriptions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create packs table
CREATE TABLE IF NOT EXISTS packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_months integer NOT NULL,
  price numeric NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view packs"
  ON packs FOR SELECT
  TO public
  USING (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (true);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  contact_type text DEFAULT 'form',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create contacts"
  ON contacts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id uuid NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial packs
INSERT INTO packs (name, duration_months, price, features, popular) VALUES
  ('Pack Découverte', 1, 10, '["Consultation voyance", "Support par email", "Accès aux prédictions mensuelles"]', false),
  ('Pack Évolution', 3, 25, '["Consultations illimitées", "Support prioritaire", "Accès aux prédictions mensuelles", "Horoscope personnalisé"]', true),
  ('Pack Harmonie', 6, 35, '["Consultations illimitées", "Support VIP 24/7", "Prédictions personnalisées", "Horoscope détaillé", "Guidance spirituelle"]', false),
  ('Pack Destinée', 12, 50, '["Consultations illimitées", "Support VIP 24/7", "Prédictions personnalisées avancées", "Horoscope détaillé", "Guidance spirituelle premium", "Séances de méditation guidées"]', false)
ON CONFLICT DO NOTHING;

-- Insert 50 testimonials
INSERT INTO testimonials (author_name, content, rating) VALUES
  ('Sophie Martin', 'Une expérience exceptionnelle ! La voyante a su cerner ma situation avec une précision incroyable.', 5),
  ('Julien Dubois', 'Consultation très professionnelle, j''ai obtenu les réponses que je cherchais.', 5),
  ('Marie Leclerc', 'Incroyable précision dans les prédictions. Je recommande vivement !', 5),
  ('Pierre Moreau', 'Un vrai don de voyance. Merci pour cette guidance précieuse.', 5),
  ('Nathalie Bernard', 'Service exceptionnel, très à l''écoute et bienveillant.', 5),
  ('Lucas Petit', 'Les prédictions se sont réalisées ! Merci infiniment.', 5),
  ('Emma Rousseau', 'Une aide précieuse dans un moment difficile de ma vie.', 5),
  ('Thomas Blanc', 'Professionnalisme et empathie. Consultation au top.', 5),
  ('Camille Laurent', 'J''ai retrouvé espoir grâce à cette consultation. Merci !', 5),
  ('Alexandre Girard', 'Voyance authentique et sincère. Je reviendrai sans hésiter.', 5),
  ('Isabelle Faure', 'Des conseils judicieux qui m''ont vraiment aidée.', 5),
  ('Nicolas Simon', 'Extraordinaire ! Une vraie connexion spirituelle.', 5),
  ('Laura Michel', 'Précision remarquable dans les détails de ma vie.', 5),
  ('Maxime Lefevre', 'Service de qualité, je suis très satisfait.', 5),
  ('Céline Garcia', 'Une guidance lumineuse dans mes choix de vie.', 5),
  ('Antoine Martinez', 'Consultation enrichissante et révélatrice.', 5),
  ('Sarah Roux', 'Un grand merci pour votre aide et votre écoute.', 5),
  ('Hugo Vincent', 'Voyance d''une grande justesse. Impressionnant !', 5),
  ('Aurélie Fournier', 'Je me sens apaisée après cette consultation.', 5),
  ('Benjamin Morel', 'Des prédictions qui se sont avérées exactes.', 5),
  ('Manon Andre', 'Service irréprochable et résultats au rendez-vous.', 5),
  ('Romain Mercier', 'Une expérience spirituelle inoubliable.', 5),
  ('Océane Blanc', 'Merci pour cette belle rencontre et ces révélations.', 5),
  ('Florian Garnier', 'Voyance sérieuse et professionnelle.', 5),
  ('Léa Chevalier', 'J''ai trouvé les réponses que je cherchais depuis longtemps.', 5),
  ('Mathis Roussel', 'Un don exceptionnel au service des autres.', 5),
  ('Chloé Giraud', 'Bienveillance et précision, merci pour tout.', 5),
  ('Dylan Lambert', 'Consultation très éclairante sur mon avenir.', 5),
  ('Lucie Bonnet', 'Je recommande à tous ceux qui cherchent des réponses.', 5),
  ('Kevin Dupuis', 'Une aide précieuse pour mes décisions importantes.', 5),
  ('Julie Clement', 'Merci pour cette guidance spirituelle si juste.', 5),
  ('Quentin Gauthier', 'Voyance authentique, loin des charlatans.', 5),
  ('Anaïs Bertrand', 'Un moment magique et révélateur.', 5),
  ('Valentin Muller', 'Service exceptionnel, je suis comblé.', 5),
  ('Marion Robert', 'Des prédictions étonnantes de précision.', 5),
  ('Jordan Lefebvre', 'Merci pour votre don et votre générosité.', 5),
  ('Pauline Morin', 'Une expérience bouleversante et positive.', 5),
  ('Adrien Nicolas', 'Je me sens guidé et rassuré. Merci !', 5),
  ('Clara Simon', 'Voyance d''une qualité remarquable.', 5),
  ('Nathan Laurent', 'Un vrai professionnel de la voyance.', 5),
  ('Melissa Blanc', 'Je suis impressionnée par tant de justesse.', 5),
  ('Louis Garcia', 'Merci pour cette belle consultation.', 5),
  ('Jade Martinez', 'Un grand moment de spiritualité.', 5),
  ('Tom Roux', 'Prédictions précises et conseils avisés.', 5),
  ('Emilie Vincent', 'Je recommande sans hésitation !', 5),
  ('Arthur Fournier', 'Une guidance éclairée et bienveillante.', 5),
  ('Lisa Morel', 'Merci pour votre aide précieuse.', 5),
  ('Enzo Andre', 'Voyance de qualité, service impeccable.', 5),
  ('Nina Mercier', 'Une expérience unique et enrichissante.', 5),
  ('Gabriel Fontaine', 'Des révélations qui ont changé ma vie. Gratitude infinie !', 5)
ON CONFLICT DO NOTHING;