import pandaApiClient from '../utils/pandaApiClient.js';
import handleAxiosError from '../utils/handleAxiosError.js';
import validateProduct from '../utils/validateProduct.js';
import { Product } from '../models/Product.js';
import { ElectronicProduct } from '../models/ElectronicProduct.js';

const elecTag = '전자제품';

/**
 * 상품 리스트를 조회합니다.
 * 
 * 전자제품 태그 여부에 따라 Product 또는 ElectronicProduct 인스턴스를 생성합니다.
 * @param {number} page - 페이지 번호
 * @param {number} pageSize - 페이지당 항목 수
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<(Product|ElectronicProduct)[]>} 상품 인스턴스 배열
 */
const getProductList = async (page, pageSize, keyword) => {
  try {
    const res = await pandaApiClient.get('/products', {
      params: {
        page,
        pageSize,
        keyword
      }
    });
    const productList = res.data?.list || [];

    return productList
      .filter(validateProduct)
      .map(i => {
        const isElectronic = i.tags?.some(tag =>
          tag.replace(/^#/, '').split(',').includes(elecTag)
        );

        return isElectronic ? new ElectronicProduct(i) : new Product(i);
      });
  } catch (e) {
    return handleAxiosError(e, getProductList.name);
  }
}

/**
 * 개별 상품을 조회합니다.
 * 
 * 상품이 없거나 에러가 나면 rejected 대신 null을 반환합니다.
 * → handleAxiosError 참조. (fail-safe API)
 * @param {number} i - 상품 ID
 * @returns {Promise<Object|null>} 유효한 상품 데이터 또는 null
 */
const getProduct = async (i) => {
  try {
    const res = await pandaApiClient.get(`/products/${i}`);
    const data = res.data;

    if (!validateProduct(data)) return null;
    return data;

    /* const isElectronic = data.tags?.includes('전자제품');
    return isElectronic ? new ElectronicProduct(data) : new Product(data); */
  } catch (e) {
    return handleAxiosError(e, getProduct.name);
  }
}

/**
 * 상품을 생성합니다.
 * @param {Object} product - 상품 정보
 * @param {string} product.name - 상품명
 * @param {string} product.description - 상품 설명
 * @param {number} product.price - 가격
 * @param {string[]} product.tags - 해시태그 배열
 * @param {string[]} product.images - 이미지 URL 배열
 * @returns {Promise<Object|null>} 생성된 상품 데이터
 */
const createProduct = async ({ name, description, price, tags, images }) => {
  try {
    const res = await pandaApiClient.post('/products/', {
      name,
      description,
      price,
      tags,
      images
    });
    return res.data;
  } catch (e) {
    return handleAxiosError(e, createProduct.name);
  }
};

/**
 * 상품 정보를 수정합니다.
 * @param {number} i - 상품 ID
 * @param {Object} body - 수정할 항목이 담긴 객체
 * @returns {Promise<Object|null>} 수정된 상품 데이터
 */
const patchProduct = async (i, body) => {
  try {
    const res = await pandaApiClient.patch(`/products/${i}`, body);
    return res.data;
  } catch (e) {
    return handleAxiosError(e, patchProduct.name);
  }
};

/**
 * 상품을 삭제합니다.
 * @param {number} i - 상품 ID
 * @returns {Promise<Object|null>} 삭제 결과
 */
const deleteProduct = async (i) => {
  try {
    const res = await pandaApiClient.delete(`/products/${i}`);
    return res.data;
  } catch (e) {
    return handleAxiosError(e, deleteProduct.name);
  }
};

export { getProductList, getProduct, createProduct, patchProduct, deleteProduct };