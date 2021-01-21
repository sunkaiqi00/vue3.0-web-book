import router from '../router'
import useGetCategoryText from './useGetCategoryText'
import useGetCategoryName from './useGetCategoryName'

const useShowAllCategoryBook = (category, ctx) => {
  router.push({
    path: '/store/list',
    query: {
      category: useGetCategoryName(category),
      categoryText: useGetCategoryText(category, ctx)
    }
  })
}

export default useShowAllCategoryBook
