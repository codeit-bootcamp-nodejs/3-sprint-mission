import axios from "axios";

const BASE_URL = "https://panda-market-api-crud.vercel.app/articles"
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 7_000
})

export const getArticleList = async (params = {}) => {
  try {
    const res = await instance.get('/', { params })
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('ArticleList 결과:' + ' ' + '에러 발생', error.response.status, error.response.statusText)
    } else {
      console.error('Axios error:', error.response.status, error.response.statusText)
    }
  }
}

export const getArticle = async (id) => {
  try {
    const res = await instance.get(`/${id}`)
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Article 결과: ' + id + ' ' + '게시글 불러올 수 없음', error.response.status, error.response.statusText)
    } else {
      console.error('Axios error:', error.response.status, error.response.statusText)
    }
  }
}

export const deleteArticle = async (id) => {
  try {
    const res = await instance.delete(`/${id}`)
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Article Delete 결과:' + id + ' ' + '이미 삭제된 게시글입니다.', error.response.status, error.response.statusText)
    } else {
      console.error('Axios error:', error.response.status, error.response.statusText)
    }
  }
}

export const createArticle = async ({ title, content, image }) => {
  try {
    const res = await instance.post('/', {
      title,
      content,
      image
    })
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Article Post 결과: ' + '에러 발생', error.response.status, error.response.statusText)
    } else {
      console.error('Axios error:', error.response.status, error.response.statusText)
    }
  }
}

export const patchArticle = async (id, { title, content, image }) => {
  try {
    const res = await instance.patch(`/${id}`, {
      title,
      content,
      image
    })
    if (res.status < 200 || res.status >= 300) {
      console.error('비정상 응답:', res.status)
      return null
    }
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Article Patch 결과:' + id + ' ' + '기사 수정 불가', error.response.status, error.response.statusText)
    } else {
      console.error('Axios error:', error.response.status, error.response.statusText)
    }
  }
}