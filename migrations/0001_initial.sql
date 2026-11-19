-- Better Auth uses D1 directly. Passwords are stored only as Better Auth hashes.
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  username TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY NOT NULL,
  expiresAt TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS session_userId_idx ON "session"(userId);

CREATE TABLE IF NOT EXISTS "account" (
  id TEXT PRIMARY KEY NOT NULL,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt TEXT,
  refreshTokenExpiresAt TEXT,
  scope TEXT,
  password TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS account_userId_idx ON "account"(userId);

CREATE TABLE IF NOT EXISTS "verification" (
  id TEXT PRIMARY KEY NOT NULL,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS verification_identifier_idx ON "verification"(identifier);

CREATE TABLE IF NOT EXISTS catalog_managers (
  user_id TEXT PRIMARY KEY NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE CHECK (username = lower(username) AND length(username) BETWEEN 3 AND 30),
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS catalog_setup (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO catalog_setup (key, value) VALUES ('admin-bootstrap', 'pending');

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 120),
  brand TEXT NOT NULL CHECK (brand IN ('br', 'bressy-rosse')),
  category TEXT NOT NULL CHECK (category IN ('material-escolar', 'juguetes', 'cocina', 'bisuteria', 'cosmeticos')),
  description TEXT CHECK (description IS NULL OR length(description) <= 1200),
  price_centavos INTEGER NOT NULL CHECK (price_centavos >= 0),
  promo_price_centavos INTEGER CHECK (promo_price_centavos IS NULL OR (promo_price_centavos >= 0 AND promo_price_centavos < price_centavos)),
  image_path TEXT,
  image_alt TEXT CHECK (image_alt IS NULL OR length(image_alt) <= 180),
  is_published INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0, 1)),
  show_in_discounts INTEGER NOT NULL DEFAULT 0 CHECK (show_in_discounts IN (0, 1)),
  promo_starts_at TEXT,
  promo_ends_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (
    (brand = 'br' AND category IN ('material-escolar', 'juguetes', 'cocina', 'bisuteria'))
    OR (brand = 'bressy-rosse' AND category = 'cosmeticos')
  ),
  CHECK (show_in_discounts = 0 OR promo_price_centavos IS NOT NULL),
  CHECK (promo_starts_at IS NULL OR promo_ends_at IS NULL OR promo_starts_at < promo_ends_at)
);

CREATE INDEX IF NOT EXISTS products_public_catalog_idx
  ON products (brand, category, created_at DESC)
  WHERE is_published = 1;

CREATE INDEX IF NOT EXISTS products_discount_catalog_idx
  ON products (promo_starts_at, promo_ends_at)
  WHERE is_published = 1 AND show_in_discounts = 1;
