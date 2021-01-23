import axios from 'axios'

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

export function downloadBook() {

}
