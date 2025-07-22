import axios from "axios";

const BASE_URL = "https://panda-market-api-crud.vercel.app/articles"
const instance = axios.create({
  baseURL : BASE_URL,
  timeout: 7_000
})

export const getArticleList = async (params = {}) => {
  try{
    const res = await instance.get('/', {params})
    return res.data; //응답 본문
  } catch (error) {
    console.error('에러 발생', error.message)
  }
}

export const getArticle = async (id) => {
  try{
    const res = await instance.get(`/${id}`)
    return res.data;
  } catch (error) {
    console.error('에러 발생', error.message)
  }
}

export const deleteArticle = async (id) => {
  try{
    const res = await instance.delete(`/${id}`)
    return res.data;
  } catch (error) {
    console.error('게시물 삭제 불가', error.message)
  }
}

export const createArticle = async ({title, content, image}) => {
  try{
    const res = await instance.post('/',{
      title,
      content,
      image})
    return res.data;
  } catch (error) {
    console.error('에러 발생', error.message)
  }
}

export const patchArticle = async (id, {title, content, image}) => {
  try{
    const res = await instance.patch(`/${id}`,{
      title,
      content,
      image})
    return res.data
  } catch (error) {
    console.error('기사 수정 불가', error.message)
  }
}
// getArticleList() : GET 메소드를 사용해 주세요.
//      page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
// getArticle() : GET 메소드를 사용해 주세요.
// createArticle() : POST 메소드를 사용해 주세요.
//      request body에 title, content, image 를 포함해 주세요.
// patchArticle() : PATCH 메소드를 사용해 주세요.
// deleteArticle() : DELETE 메소드를 사용해 주세요.
// fetch 혹은 axios를 이용해 주세요.
//      응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
// .then() 메소드를 이용하여 비동기 처리를 해주세요.
// .catch() 를 이용하여 오류 처리를 해주세요.