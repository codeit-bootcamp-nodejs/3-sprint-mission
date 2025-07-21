import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from "./ArticleService.js";
import { patchProduct, createProduct, deleteProduct, getProduct, getProductList } from "./ProductService.js";
import Product, { ElectronicProduct } from "./Product.js";
import Article from "./Article.js"

const searchpage = {
  page: 1,
  pageSize: 5,
  keyword: ''
}
const articleInfo = {
  title: '2025년 삼성의 새로운 플래그십 스마트폰 출시',
  content: '게시글 내용',
  image: 'https://example.com/...://',
  writer: '익명'
}
const articleChangedInfo = {
  title: '2025년 삼성의 새로운 플래그십 스마트폰50 출시',
  content: '게시글 내용',
  image: 'https://example.com/...://'
}
const user = {
  firstName: 'Fred',
  lastName: 'Flintstone'
}
const productInfo = {
  name: '오만원권',
  description: "한국은행",
  price: '50000',
  tags: '일반제품',
  images: 'https://example.com/...://'
}
const productInfo2 = {
  name: 'Samsung galaxy z flip3',
  description: "삼성",
  price: '50000',
  tags: '전자제품',
  images: 'https://example.com/...://'
}

const article = new Article(
  articleInfo.title,
  articleInfo.content,
  `${user.firstName} ${user.lastName}`
);
const product = new Product(
  productInfo.name,
  productInfo.description,
  productInfo.price,
  productInfo.tags,
  productInfo.images,
  0
);
let articleID = Math.floor(Math.random() * 101 + 1500)
let productID = Math.floor(Math.random() * 101 + 1000)

const searchProduct = await getProduct(productID)
const searchArticle = await getArticle(articleID)
const productList = await getProductList(searchpage)
const articleList = await getArticleList(searchpage)
const productPost = await createProduct(productInfo)
const articlePost = await createArticle(articleInfo)
const articlePatch = await patchArticle(1512, articleChangedInfo)
const productPatch = await patchProduct(1063, productInfo2)
const deleteProductPage = await deleteProduct(productID)
const deleteArticlePage = await deleteArticle(articleID)
const tagFilter = await getProductList(searchpage)
  .then((data) => {
    try {
      let products = []
      for (let product of data.list) {
        if (product.tags.includes('전자제품')) {
          let electronicProductInstance = new ElectronicProduct(product.name, product.description, product.price, product.tags, product.images, product.favoriteCount || 0, product.manufacturer || '')
          products.push(electronicProductInstance)
        } else {
          let productInstance = new Product(product.name, product.description, product.price, product.tags, product.images, product.favoriteCount || 0)
          products.push(productInstance)
        }
      }
      return products;
    } catch (error) {
      console.log('상품 불러오기 중 에러', error.message)
      return []
    }
  })

console.log('ProductList 결과:', productList)
console.log('getProduct 결과:', searchProduct, `${productID}`)
console.log('Product Post 결과:', productPost)
console.log('Product Patch 결과:', productPatch)
console.log('Product Delete 결과:', deleteProductPage)
console.log('getProduct 결과:', searchProduct, `${productID}`)

console.log(product._name, product._description, product._price, product._favoriteCount);
product.favorite();
console.log(product.favoriteCount);

tagFilter.forEach(item => {
  if (item instanceof ElectronicProduct) {
    console.log(item, '✅ 전자제품');
  } else if (item instanceof Product) {
    console.log(item, '✅ 일반상품');
  } else {
    console.log('❌ 알 수 없는 타입입니다.');
  }
});

console.log('')

console.log('ArticleList 결과:', articleList)
console.log('Article 결과:', searchArticle, `${articleID}`)
console.log('Article Post 결과:', articlePost)
console.log('Article Patch 결과:', articlePatch)
console.log('Article Delete 결과:', deleteArticlePage)

console.log(article.articleTitle, article.articleWriter, article.likeCount);
article.like();
console.log(article.likeCount);

console.log('프로그램 종료')