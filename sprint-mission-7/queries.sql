/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE member
SET name = 'test'
WHERE id = 1
;
/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT * FROM product
WHERE userId = 1
ORDER BY created DESC
LIMIT 10 OFFSET 20
;
/*
  3. 내가 생성한 상품의 총 개수
*/
SELECT COUNT(*) FROM product
WHERE userId = 1
;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT * FROM product
WHERE id IN (SELECT productId FROM like_product
WHERE userId = 1
)
ORDER BY created DESC
LIMIT 10 OFFSET 20
;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT COUNT(*) FROM product
WHERE id IN (SELECT productId FROM like_product
WHERE userId = 1
)
;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO product (
    name,
    description,
    price,
    tags,
    userId
)
VALUES (
    '아이폰',
    '애플제품',
    120000,
    ARRAY['신상품'],
    1
)
;

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT
  p.*,
  (SELECT COUNT(*)
   FROM like_product lp
   WHERE lp.productId = p.id) AS like_count
FROM product p
WHERE p.name = 'test'
ORDER BY p.created DESC
LIMIT 10;
--join 방식
SELECT
  p.*,
  COUNT(lp.productId) AS like_count
FROM product p
LEFT JOIN like_product lp ON p.id = lp.productId
WHERE p.name = 'test'
GROUP BY p.id
ORDER BY p.created DESC
LIMIT 10;
/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
select * from product
where id = 1
;

/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE product
SET
    name = '아이폰 16 프로',
    price = 999000
WHERE id = 1
;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM product
WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO like_product (
  userId,
  productId
)
VALUES (
  1,
  2
);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM like_product
WHERE id IN (
  SELECT id
  FROM like_product
  WHERE userId = 1 AND productId = 2
);

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO product_inquiry (
  inquiry,
  userId,
  productId
) VALUES (
  '깍아주세요',
  1,
  2
);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT *
FROM product_inquiry
WHERE productId = 1 AND created < '2025-03-25 00:00:00'
ORDER BY created DESC
LIMIT 10;
