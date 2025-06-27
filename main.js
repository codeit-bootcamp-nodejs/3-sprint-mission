import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './src/services/ArticleService.js';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './src/services/ProductService.js';

const LINE = '\n// -------------------- //\n'

const executeArticles = async (page, pageSize, keyword) => {
  const getArticleListResult = await getArticleList(page, pageSize, keyword)

  const getArticleResult = await getArticle(1325);

  const createArticleResult = await createArticle({
    title: '오늘 저녁은 삼겹살',
    content: '기름장에 찍어먹어요',
    image: 'https://example.com/...',
  })
  const patchArticleResult = await patchArticle(1324, { content: '수정된 내용' });

  const deleteArticleResult = await deleteArticle(1);

  return { getArticleListResult, getArticleResult, createArticleResult, patchArticleResult, deleteArticleResult };
}

const executeProducts = async (page, pageSize, keyword) => {
  const getProductListResult = await getProductList(page, pageSize, keyword);

  const getProductResult = await getProduct(847);

  const createProductResult = await createProduct({
    name: '맥북',
    description: '가벼움',
    price: 2025,
    tags: ['전자제품'],
    images: ['https://example.com/...'],
  })
  const patchProductResult = await patchProduct(1, { price: 2025 });

  const deleteProductResult = await deleteProduct(800);

  return { getProductListResult, getProductResult, createProductResult, patchProductResult, deleteProductResult };
}

const main = async (page, pageSize, keyword) => {
  const productResults = await executeProducts(page, pageSize, keyword);
  const articleResults = await executeArticles(page, pageSize, keyword);

  console.log('Product 인스턴스 목록:', productResults.getProductListResult, LINE);
  console.log('getProduct 결과:', productResults.getProductResult, LINE);
  console.log('createProduct 결과:', productResults.createProductResult, LINE);
  console.log('patchProduct 결과:', productResults.patchProductResult, LINE);
  console.log('deleteProduct 결과:', productResults.deleteProductResult, LINE);

  console.log('Article 인스턴스 목록:', articleResults.getArticleListResult, LINE);
  console.log('getArticle 결과:', articleResults.getArticleResult, LINE);
  console.log('createArticle 결과:', articleResults.createArticleResult, LINE);
  console.log('patchArticle 결과:', articleResults.patchArticleResult, LINE);
  console.log('deleteArticle 결과:', articleResults.deleteArticleResult, LINE);

  return { articleResults, productResults };
}

main(1, 10, '');