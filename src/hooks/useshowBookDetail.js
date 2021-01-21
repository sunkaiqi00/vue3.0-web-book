import router from '../router'

const useshowBookDetail = book => {
  router.push({
    path: '/store/detail',
    query: {
      fileName: book.fileName,
      category: book.category
    }
  })
}

export default useshowBookDetail
