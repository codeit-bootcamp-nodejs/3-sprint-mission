import axios from "axios";

const BASE_URL = `https://panda-market-api-crud.vercel.app/products`;
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 7_000
})

export const getProductList = async (params = {}) => {
  try {
    const res = await instance.get('/', { params })
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('ProductList 결과: 제품 목록을 불러올 수 없습니다.', error.response.status, error.response.statusText);
    } else {
      console.error('ProductList 결과: ' + error.response.status, error.response.statusText)
    }
  }
}
export const getProduct = async (id) => {
  try {
    const res = await instance.get(`${id}`)
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('getProduct 결과: ' + `${id}` + ' 제품을 불러올 수 없습니다.', error.response.status, error.response.statusText);
    } else {
      console.error('getProduct 결과: ' + error.response.status, error.response.statusText)
    }
  }
}
export const deleteProduct = async (id) => {
  try {
    const res = await instance.delete(`${id}`)
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Product Delete 결과: ID' + `${id}` + ' 제품 삭제 불가', error.response.status, error.response.statusText)
    } else {
      console.error('Product Delete 결과: ' + error.response.status, error.response.statusText)
    }
  }
}
export const createProduct = async ({ name, description, price, tags, images }) => {
  try {
    const res = await instance.post('/', {
      name,
      description,
      price,
      tags,
      images
    })
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Product Post 결과: 에러 발생', error.response.status, error.response.statusText)
    } else {
      console.error('Product Post 결과: ' + error.response.status, error.response.statusText)
    }
  }
}
export const patchProduct = async (id, { name, description, price, tags, images }) => {
  try {
    const res = await instance.patch(`/${id}`, {
      name,
      description,
      price,
      tags,
      images
    })
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Patch Product 결과: ID ' + `${id}` + '는 존재하지 않는 제품입니다.', error.response.status, error.response.statusText)
    } else {
      console.error('Patch Product 결과: ' + error.response.status, error.response.statusText)
    }
  }
}