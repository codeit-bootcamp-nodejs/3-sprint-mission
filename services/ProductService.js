import axios from "axios";

const BASE_URL = `https://panda-market-api-crud.vercel.app/products`;
const instance = axios.create({
  baseURL : BASE_URL,
  timeout: 7_000
})

export const getProductList = async (params = {}) => {
  try{
    const res = await instance.get('/', {params})
    return res.data;
  } catch (error) {
    console.error('에러 발생', error.message);
  }
}
export const getProduct = async (id) => {
  try{
    const res = await instance.get(`${id}`)
    return res.data;
  } catch (error) {
    console.error('에러 발생', error.message);
  }
}
export const deleteProduct = async (id) => {
  try{
    const res = await instance.delete(`${id}`)
    return res.data
  } catch (error) {
    console.error('제품 삭제 불가', error.message)
  }
}
export const createProduct = async ({name, description, price, tags, images}) => {
  try{
    const res = await instance.post('/',{
      name,
      description,
      price,
      tags,
      images})
    return res.data;
  } catch (error) {
    console.error('에러 발생', error.message)
  }
}
export const patchProduct = async (id, {name, description, price, tags, images}) => {
  try{
    const res = await instance.patch(`/${id}`,{
      name,
      description,
      price,
      tags,
      images})
    return res.data
  } catch (error) {
    console.error('제품 수정 불가', error.message)
  }
}