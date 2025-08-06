import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js';
import { getArticle, getArticleList, createArticle, patchArticle, deleteArticle } from './ArticleService.js';

// ================================== Product Class ==================================
class Product {
    _name: string;
    _description: string;
    _price: number;
    _tags: string[];
    _images: string[];
    _favoriteCount: number;
    constructor(name: string, description: string, price: number, tags: string[], images: string[], favoriteCount: number = 0) {
        this._name = name; // 이름
        this._description = description; // 상품 설명
        this._price = price; // 판매가격
        this._tags = tags; // 해시태그배열
        this._images = images; // 이미지 배열 
        this._favoriteCount = favoriteCount; // 찜하기 수
    }

    favorit() {
        this._favoriteCount++; //0, 100
    }

};

class ElectronicProduct extends Product {
    _manufacturer: string
    constructor(name: string, description: string, price: number, tags: string[], images: string[], favoriteCount: number = 0, manufacturer: string) {
        super(name, description, price, tags, images, favoriteCount);
        this._manufacturer = manufacturer;
    }
};

// ================================== Article Class ==================================
class Article {
    _title: string;
    _content: string;
    _writer: string;
    _likeCount: number;
    _createdAt: Date;
    constructor(title: string, content: string, writer: string, likeCount: number) {
        this._title = title;
        this._content = content;
        this._writer = writer;
        this._likeCount = likeCount;
        this._createdAt = new Date();
    }

    like() {
        this._likeCount++;
    }
};

// ================================== Article Service ==================================
const url = new URL(`https://panda-market-api-crud.vercel.app/articles`);
const articleId = 1532 // 테스트시 실제 있는 id로 변경 필요
console.log(await createArticle(url, "https://example.com/..",
    "라면",
    "저녁메뉴"
));
console.log(await getArticle(url, articleId));
console.log(await patchArticle(url, articleId,
    "https://example.com/..",
    "돈까스",
    "점심메뉴"
));
console.log(await deleteArticle(url, articleId));
console.log(await getArticleList(url, '1', '5', ""));


// ================================== ProductService ==================================
const productId = 1076 // 테스트시 실제 있는 id로 변경 필요
const requestBody = {
    "name": "테스트상품",
    "description": "테스트용",
    "price": 100,
    "tags": ["베타", "전자제품"],
    "images": ["https://example.com/..."]
}
console.log(await getProductList(1, 3, ""));
console.log(await getProduct(productId));
console.log(await createProduct(requestBody));
console.log(await patchProduct(productId, requestBody));
console.log(await deleteProduct(productId));
console.log(await getProductList(1, 3, ""));


// ================================== getProductList() ==================================

const productList = await getProductList(1, 4, "");

const products = []; // 상품 전달받는 배열

for (const pd of productList.list) {
    if (pd.tags.includes("전자제품"))
        products.push(new ElectronicProduct(pd.name, pd.description, pd.price, pd.tags, pd.images, pd.favoriteCount, pd.manufacturer));
    else
        products.push(new Product(pd.name, pd.description, pd.price, pd.tags, pd.images, pd.favoriteCount));
}

console.log(`============상품 목록==========`);
console.log(products);

