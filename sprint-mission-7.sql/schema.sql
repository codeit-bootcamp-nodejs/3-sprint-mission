-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    nickname VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() 
)
;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() 
)
;

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
)
;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL,
    target_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)
;

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL,
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, target_type, target_id)
)
;

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL,
    target_id INTEGER NOT NULL,
    url VARCHAR(255) NOT NULL,
    width INTEGER,
    height INTEGER,
    format VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX (target_type, target_id)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE product_tags (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);