CREATE TABLE user (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nickname VARCHAR(20) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NULL,
    auth_type ENUM('local','social') NOT NULL DEFAULT 'local',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_email CHECK (email LIKE '%@%'),
    CONSTRAINT chk_auth_type_password
        CHECK (
            (auth_type = 'local' AND password IS NOT NULL) OR
            (auth_type = 'social' AND password IS NULL)
		)
);

CREATE TABLE social_account (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    provider ENUM('google','kakao') NOT NULL,
    provider_id VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_provider_providerid (provider, provider_id),
    UNIQUE KEY uq_user_provider (user_id, provider),
    FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE TABLE product (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	name VARCHAR(20) NOT NULL,
	price INT NOT NULL,
	image VARCHAR(255) NULL,
	description TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE TABLE product_like (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE tag (
	id INT PRIMARY KEY AUTO_INCREMENT,
    value VARCHAR(20) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_tag (
	id INT PRIMARY KEY AUTO_INCREMENT,
    tag_id INT NOT NULL,
    product_id INT NOT NULL,
    UNIQUE KEY uq_product_tag (product_id, tag_id),
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE article (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE TABLE article_like (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_article (user_id, article_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE
);

CREATE TABLE article_tag (
	id INT PRIMARY KEY AUTO_INCREMENT,
    tag_id INT NOT NULL,
    article_id INT NOT NULL,
    UNIQUE KEY uq_article_tag (article_id, tag_id),
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE
);

CREATE TABLE comment (
	id INT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(300),
    user_id INT NOT NULL,
    product_id INT NULL,
    article_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT chk_product_or_article CHECK (
		(product_id IS NOT NULL AND article_id IS NULL)
		OR
		(product_id IS NULL AND article_id IS NOT NULL)
	)
);

-- 예시 값

-- 1. user
INSERT INTO user (nickname, email, password, auth_type)
VALUES
('홍길동', 'hong@example.com', 'hashed_password_1', 'local'),
('이영희', 'lee@example.com', 'hashed_password_2', 'local'),
('김철수', 'kim@example.com', NULL, 'social');

-- 2. social_account (김철수 → social 계정)
INSERT INTO social_account (user_id, provider, provider_id)
VALUES
(3, 'google', 'google_12345');

-- 3. product
INSERT INTO product (user_id, name, price, image, description)
VALUES
(1, '테스트상품1', 10000, 'prod1.jpg', '테스트 상품 1의 설명'),
(2, '테스트상품2', 20000, 'prod2.jpg', '테스트 상품 2의 설명');

-- 4. product_like
INSERT INTO product_like (user_id, product_id)
VALUES
(2, 1), -- 이영희 → 홍길동 상품 좋아요
(1, 2); -- 홍길동 → 이영희 상품 좋아요

-- 5. tag
INSERT INTO tag (value)
VALUES
('전자제품'),
('생활용품'),
('할인');

-- 6. product_tag
INSERT INTO product_tag (tag_id, product_id)
VALUES
(1, 1), -- 전자제품 → 상품1
(3, 1), -- 할인 → 상품1
(2, 2); -- 생활용품 → 상품2

-- 7. article
INSERT INTO article (user_id, title, content, image)
VALUES
(1, '첫 번째 글', '이것은 첫 번째 글 내용입니다.', 'art1.jpg'),
(2, '두 번째 글', '이것은 두 번째 글 내용입니다.', NULL);

-- 8. article_like
INSERT INTO article_like (user_id, article_id)
VALUES
(2, 1), -- 이영희 → 홍길동 글 좋아요
(1, 2); -- 홍길동 → 이영희 글 좋아요

-- 9. article_tag
INSERT INTO article_tag (tag_id, article_id)
VALUES
(3, 1), -- 할인 → 글1
(2, 2); -- 생활용품 → 글2

-- 10. comment
-- 상품1에 댓글
INSERT INTO comment (content, user_id, product_id, article_id)
VALUES
('좋은 상품이네요!', 2, 1, NULL);

-- 글1에 댓글
INSERT INTO comment (content, user_id, product_id, article_id)
VALUES
('좋은 글 잘 읽었습니다.', 3, NULL, 1);



