import { hashPassword } from "../src/utils/passwordHash";

const MOCK_USER1 = {
    id: 1,
    email: "test1@example.com",
    nickname: "testuser1",
    image: [],
    password: hashPassword("password1"),
    refreshToken: null,
};

const MOCK_USER2 = {
    id: 2,
    email: "test2@example.com",
    nickname: "testuser2",
    image: [],
    password: hashPassword("password2"),
    refreshToken: null,
};

const MOCK_ARTICLE1 = {
    id: "270762ec-35de-45ba-8578-4276391bcaf7",
    title: "테스트 아티클1",
    content: "게시글 1번의 내용입니다.",
    userId: 1,
};

const MOCK_ARTICLE2 = {
    id: "246e7bd7-3add-47d9-9c23-721027817359",
    title: "테스트 아티클2",
    content: "게시글 2번의 내용입니다.",
    userId: 2,
};

const MOCK_PRODUCT1 = {
    id: "ac37600b-627a-4195-91b7-2b52b50172df",
    name: "테스트 상품 1",
    description: "멋진 상품.",
    price: 100,
    tags: ["test", "product"],
    userId: 1,
};

const MOCK_PRODUCT2 = {
    id: "29c17569-4803-4540-9451-b75afde9cb67",
    name: "테스트 상품 2",
    description: "짱짱 멋진 상품.",
    price: 200,
    tags: ["test", "another-product"],
    userId: 2,
};

const MOCK_ARTICLE_COMMENT1 = {
    id: "849c2109-ab70-480f-8c52-e6f0b7cae430",
    content: "아티클 1에 달린 댓글입니다.",
    articleId: "270762ec-35de-45ba-8578-4276391bcaf7",
    userId: 2,
};

const MOCK_PRODUCT_COMMENT1 = {
    id: "28a30bd7-8861-4a69-9ef6-f8d5d019f5db",
    content: "상품1에 달린 댓글입니다.",
    productId: "ac37600b-627a-4195-91b7-2b52b50172df",
    userId: 2,
};


const MOCK = {
    articles : [MOCK_ARTICLE1, MOCK_ARTICLE2],
    products : [MOCK_PRODUCT1, MOCK_PRODUCT2],
    users: [MOCK_USER1, MOCK_USER2],
    articleComments : [MOCK_ARTICLE_COMMENT1],
    productComments : [MOCK_PRODUCT_COMMENT1]
}

export default MOCK;