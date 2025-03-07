CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  embedding VECTOR(512),
  metadata JSONB
);

CREATE TABLE uploads (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  embedding VECTOR(512),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
