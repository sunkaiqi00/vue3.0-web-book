import axios from 'axios'
import { setLocalForage } from '@/utils/localForage'
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

export const home = () => {
  return axios({
    method: 'get',
    url: '/book/home'
  })
}

export function getBookDetail(book) {
  return axios({
    method: 'get',
    url: '/book/detail',
    params: {
      fileName: book.fileName
    }
  })
}

export function getShelf() {
  return axios({
    method: 'get',
    url: '/book/shelf'
  })
}

export function getList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function downloadBook(book, onSuccess, onError, onProgress) {
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    responseType: 'blob',
    timeout: 180 * 1000,
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  })
    .get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data])
      setLocalForage(
        book.fileName, blob,
        () => {
          if (onSuccess) onSuccess(book)
        },
        () => {
          // eslint-disable-next-line no-undef
          if (onError) onError(err)
        }
      )
    }).catch(err => {
      if (onError) onError(err)
    })
}
